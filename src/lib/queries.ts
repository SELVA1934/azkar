import "server-only";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  azkar,
  azkarCategories,
  azkarProgress,
  dailyCompletions,
  favorites,
  tasbihSessions,
} from "@/db/schema";
import { computeStreak, shiftDay } from "@/lib/islamic";
import type { Locale } from "@/i18n";
import { fmt } from "@/i18n";
import { ensureSeeded } from "@/lib/seed";

export async function getCategories() {
  await ensureSeeded();
  const cats = await db.select().from(azkarCategories).orderBy(azkarCategories.sortOrder);
  const counts = await db
    .select({ categoryId: azkar.categoryId, count: sql<number>`count(*)::int` })
    .from(azkar)
    .groupBy(azkar.categoryId);
  const countMap = new Map(counts.map((c) => [c.categoryId, c.count]));
  return cats.map((c) => ({ ...c, itemCount: countMap.get(c.id) ?? 0 }));
}

export async function getCategoryWithItems(slug: string) {
  await ensureSeeded();
  const [cat] = await db.select().from(azkarCategories).where(eq(azkarCategories.slug, slug)).limit(1);
  if (!cat) return null;
  const items = await db.select().from(azkar).where(eq(azkar.categoryId, cat.id)).orderBy(azkar.sortOrder);
  return { category: cat, items };
}

export async function getUserProgressForDay(userId: number, categorySlug: string, day: string) {
  const rows = await db
    .select({ azkarId: azkarProgress.azkarId, count: azkarProgress.count, completed: azkarProgress.completed })
    .from(azkarProgress)
    .where(
      and(eq(azkarProgress.userId, userId), eq(azkarProgress.categorySlug, categorySlug), eq(azkarProgress.day, day)),
    );
  return rows;
}

export async function getFavoriteIds(userId: number): Promise<number[]> {
  const rows = await db.select({ azkarId: favorites.azkarId }).from(favorites).where(eq(favorites.userId, userId));
  return rows.map((r) => r.azkarId);
}

export async function getFavoriteAzkar(userId: number) {
  await ensureSeeded();
  return db
    .select({
      id: azkar.id,
      arabic: azkar.arabic,
      transliteration: azkar.transliteration,
      translation: azkar.translation,
      repeatCount: azkar.repeatCount,
      reference: azkar.reference,
      virtue: azkar.virtue,
      virtueArabic: azkar.virtueArabic,
      categorySlug: azkarCategories.slug,
      categoryTitle: azkarCategories.title,
      savedAt: favorites.createdAt,
    })
    .from(favorites)
    .innerJoin(azkar, eq(favorites.azkarId, azkar.id))
    .innerJoin(azkarCategories, eq(azkar.categoryId, azkarCategories.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
}

export async function getTodayCompletions(userId: number, day: string): Promise<string[]> {
  const rows = await db
    .select({ slug: dailyCompletions.categorySlug })
    .from(dailyCompletions)
    .where(and(eq(dailyCompletions.userId, userId), eq(dailyCompletions.day, day)));
  return rows.map((r) => r.slug);
}

/** Per-category progress for today: how many azkar items completed out of total. */
export async function getTodayCategoryProgress(userId: number, day: string) {
  const rows = await db
    .select({
      slug: azkarProgress.categorySlug,
      done: sql<number>`count(*) filter (where ${azkarProgress.completed})::int`,
    })
    .from(azkarProgress)
    .where(and(eq(azkarProgress.userId, userId), eq(azkarProgress.day, day)))
    .groupBy(azkarProgress.categorySlug);
  return new Map(rows.map((r) => [r.slug, r.done]));
}

export async function getStreakAndActivity(userId: number, today: string) {
  const since = shiftDay(today, -365);
  const rows = await db
    .selectDistinct({ day: dailyCompletions.day })
    .from(dailyCompletions)
    .where(and(eq(dailyCompletions.userId, userId), gte(dailyCompletions.day, since)))
    .orderBy(desc(dailyCompletions.day));
  const days = rows.map((r) => r.day);
  const streak = computeStreak(days, today);

  // Last 7 days activity flags
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = shiftDay(today, -(6 - i));
    return { day: d, active: days.includes(d) };
  });

  const [{ totalCompletions }] = await db
    .select({ totalCompletions: sql<number>`count(*)::int` })
    .from(dailyCompletions)
    .where(eq(dailyCompletions.userId, userId));

  return { streak, last7, totalCompletions, activeDays: days.length };
}

export async function getTasbihStats(userId: number, today: string) {
  const [totals] = await db
    .select({
      total: sql<number>`coalesce(sum(${tasbihSessions.count}), 0)::int`,
      sessions: sql<number>`count(*)::int`,
      todayTotal: sql<number>`coalesce(sum(${tasbihSessions.count}) filter (where ${tasbihSessions.day} = ${today}), 0)::int`,
    })
    .from(tasbihSessions)
    .where(eq(tasbihSessions.userId, userId));
  return totals;
}

export async function getRecentTasbihSessions(userId: number, limit = 12) {
  return db
    .select()
    .from(tasbihSessions)
    .where(eq(tasbihSessions.userId, userId))
    .orderBy(desc(tasbihSessions.createdAt))
    .limit(limit);
}

export async function getCategoryCompletionCounts(userId: number) {
  const rows = await db
    .select({ slug: dailyCompletions.categorySlug, count: sql<number>`count(*)::int` })
    .from(dailyCompletions)
    .where(eq(dailyCompletions.userId, userId))
    .groupBy(dailyCompletions.categorySlug);
  return new Map(rows.map((r) => [r.slug, r.count]));
}

export async function getAzkarByIds(ids: number[]) {
  if (!ids.length) return [];
  return db.select().from(azkar).where(inArray(azkar.id, ids));
}

/** Locale-aware category title. */
export function categoryTitle(
  cat: { title: string; titleArabic: string },
  locale: Locale,
): string {
  return locale === "ar" ? cat.titleArabic : cat.title;
}

/** Locale-aware category description. */
export function categoryDescription(
  cat: { description: string; descriptionArabic: string | null },
  locale: Locale,
): string {
  return locale === "ar" && cat.descriptionArabic ? cat.descriptionArabic : cat.description;
}

/** Locale-aware virtue text, falling back to English when absent. */
export function virtueText(
  item: { virtue: string | null; virtueArabic: string | null },
  locale: Locale,
): string | null {
  if (locale === "ar" && item.virtueArabic) return item.virtueArabic;
  return item.virtue;
}

/** "N items" in the active locale. */
export function itemCountLabel(count: number, locale: Locale, dict: { common: { item: string; items: string } }): string {
  if (locale === "ar") {
    return `${count} ${count === 1 ? dict.common.item : dict.common.items}`;
  }
  return `${count} ${count === 1 ? dict.common.item : dict.common.items}`;
}

/** "N days" in the active locale. */
export function daysLabel(count: number, locale: Locale, dict: { common: { day: string; days: string } }): string {
  return `${count} ${count === 1 ? dict.common.day : dict.common.days}`;
}

export { fmt };

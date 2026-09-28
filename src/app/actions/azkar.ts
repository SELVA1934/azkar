"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { azkarProgress, dailyCompletions, favorites, tasbihSessions, userSettings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function assertDay(day: string) {
  if (!DAY_RE.test(day)) throw new Error("Invalid day");
}

/** Persist the count for a single zikr on a given day (upsert). */
export async function saveZikrProgress(input: {
  azkarId: number;
  categorySlug: string;
  day: string;
  count: number;
  completed: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Not signed in" };
  assertDay(input.day);

  await db
    .insert(azkarProgress)
    .values({
      userId: user.id,
      azkarId: input.azkarId,
      categorySlug: input.categorySlug,
      day: input.day,
      count: input.count,
      completed: input.completed,
    })
    .onConflictDoUpdate({
      target: [azkarProgress.userId, azkarProgress.azkarId, azkarProgress.day],
      set: { count: input.count, completed: input.completed, updatedAt: new Date() },
    });

  return { ok: true as const };
}

/** Mark a whole category as completed for the day (idempotent). */
export async function markCategoryComplete(categorySlug: string, day: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Not signed in" };
  assertDay(day);

  await db
    .insert(dailyCompletions)
    .values({ userId: user.id, categorySlug, day })
    .onConflictDoNothing();

  revalidatePath("/");
  revalidatePath("/profile");
  return { ok: true as const };
}

/** Reset today's progress for a category. */
export async function resetCategoryProgress(categorySlug: string, day: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Not signed in" };
  assertDay(day);

  await db
    .delete(azkarProgress)
    .where(
      and(
        eq(azkarProgress.userId, user.id),
        eq(azkarProgress.categorySlug, categorySlug),
        eq(azkarProgress.day, day),
      ),
    );
  await db
    .delete(dailyCompletions)
    .where(
      and(
        eq(dailyCompletions.userId, user.id),
        eq(dailyCompletions.categorySlug, categorySlug),
        eq(dailyCompletions.day, day),
      ),
    );

  revalidatePath("/");
  revalidatePath(`/azkar/${categorySlug}`);
  return { ok: true as const };
}

export async function toggleFavorite(azkarId: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Not signed in", favorited: false };

  const existing = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.azkarId, azkarId)))
    .limit(1);

  if (existing.length) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    revalidatePath("/favorites");
    return { ok: true as const, favorited: false };
  }

  await db.insert(favorites).values({ userId: user.id, azkarId }).onConflictDoNothing();
  revalidatePath("/favorites");
  return { ok: true as const, favorited: true };
}

export async function saveTasbihSession(input: {
  phrase: string;
  phraseArabic: string;
  count: number;
  target: number;
  day: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Not signed in" };
  assertDay(input.day);
  if (input.count <= 0) return { ok: false as const, error: "Nothing to save" };

  await db.insert(tasbihSessions).values({
    userId: user.id,
    phrase: input.phrase.slice(0, 80),
    phraseArabic: input.phraseArabic.slice(0, 120),
    count: Math.min(input.count, 100000),
    target: Math.min(Math.max(input.target, 1), 100000),
    day: input.day,
  });

  revalidatePath("/tasbih");
  revalidatePath("/profile");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteTasbihSession(id: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const };
  await db.delete(tasbihSessions).where(and(eq(tasbihSessions.id, id), eq(tasbihSessions.userId, user.id)));
  revalidatePath("/tasbih");
  return { ok: true as const };
}

export async function updateSettings(input: {
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  calculationMethod?: number;
  showTransliteration?: boolean;
  showTranslation?: boolean;
  arabicFontSize?: number;
  timezone?: string;
  language?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Not signed in" };

  const set: Partial<typeof userSettings.$inferInsert> = { updatedAt: new Date() };
  if (input.city !== undefined) set.city = input.city?.trim().slice(0, 80) || null;
  if (input.country !== undefined) set.country = input.country?.trim().slice(0, 80) || null;
  if (input.latitude !== undefined) set.latitude = input.latitude;
  if (input.longitude !== undefined) set.longitude = input.longitude;
  if (input.calculationMethod !== undefined) set.calculationMethod = input.calculationMethod;
  if (input.showTransliteration !== undefined) set.showTransliteration = input.showTransliteration;
  if (input.showTranslation !== undefined) set.showTranslation = input.showTranslation;
  if (input.arabicFontSize !== undefined) set.arabicFontSize = Math.min(Math.max(input.arabicFontSize, 1), 4);
  if (input.timezone !== undefined) set.timezone = input.timezone;
  if (input.language !== undefined) set.language = input.language;

  await db
    .insert(userSettings)
    .values({ userId: user.id, ...set })
    .onConflictDoUpdate({ target: userSettings.userId, set });

  revalidatePath("/");
  revalidatePath("/prayer-times");
  revalidatePath("/profile");
  return { ok: true as const };
}



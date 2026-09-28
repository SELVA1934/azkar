import { db } from "@/db";
import { azkar, azkarCategories } from "@/db/schema";
import { SEED_CATEGORIES } from "@/data/azkar-seed";
import { CATEGORY_DESCRIPTIONS_AR, VIRTUES_AR } from "@/data/azkar-arabic";
import { and, eq, isNull, sql } from "drizzle-orm";

let seedPromise: Promise<void> | null = null;

/**
 * Idempotently seeds azkar content into the database on first use, then
 * backfills Arabic content for any rows that are missing it.
 * Safe to call from any server component or action.
 */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function seed() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(azkarCategories);

  if (count === 0) {
    await insertContent();
  }

  await enrichArabic();
}

async function insertContent() {
  await db.transaction(async (tx) => {
    for (let i = 0; i < SEED_CATEGORIES.length; i++) {
      const cat = SEED_CATEGORIES[i];
      const [inserted] = await tx
        .insert(azkarCategories)
        .values({
          slug: cat.slug,
          title: cat.title,
          titleArabic: cat.titleArabic,
          description: cat.description,
          descriptionArabic: CATEGORY_DESCRIPTIONS_AR[cat.slug] ?? null,
          icon: cat.icon,
          sortOrder: i,
        })
        .onConflictDoNothing()
        .returning({ id: azkarCategories.id });

      if (!inserted) continue;

      await tx.insert(azkar).values(
        cat.items.map((item, idx) => ({
          categoryId: inserted.id,
          arabic: item.arabic,
          transliteration: item.transliteration,
          translation: item.translation,
          repeatCount: item.repeatCount,
          reference: item.reference,
          virtue: item.virtue ?? null,
          virtueArabic: VIRTUES_AR[cat.slug]?.[idx] ?? null,
          sortOrder: idx,
        })),
      );
    }
  });
}

/**
 * Backfills Arabic descriptions/virtues for rows created before these columns
 * existed. Updates are keyed on (category slug, sort order) which is stable,
 * so existing user progress and favorites are preserved.
 */
async function enrichArabic() {
  const [missing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(azkarCategories)
    .where(isNull(azkarCategories.descriptionArabic));

  if (!missing || missing.count === 0) return;

  const catRows = await db
    .select({ id: azkarCategories.id, slug: azkarCategories.slug })
    .from(azkarCategories);

  for (const catRow of catRows) {
    const descriptionAr = CATEGORY_DESCRIPTIONS_AR[catRow.slug];
    if (descriptionAr) {
      await db
        .update(azkarCategories)
        .set({ descriptionArabic: descriptionAr })
        .where(eq(azkarCategories.id, catRow.id));
    }
    const virtues = VIRTUES_AR[catRow.slug];
    if (!virtues) continue;
    for (const [indexStr, virtueAr] of Object.entries(virtues)) {
      const idx = Number(indexStr);
      if (!Number.isInteger(idx)) continue;
      await db
        .update(azkar)
        .set({ virtueArabic: virtueAr })
        .where(and(eq(azkar.categoryId, catRow.id), eq(azkar.sortOrder, idx)));
    }
  }
}

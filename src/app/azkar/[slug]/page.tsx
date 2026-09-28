import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AzkarReader } from "@/components/AzkarReader";
import { Icon, type IconName } from "@/components/Icon";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { todayInTimezone } from "@/lib/islamic";
import {
  categoryDescription,
  categoryTitle,
  getCategoryWithItems,
  getFavoriteIds,
  getTodayCompletions,
  getUserProgressForDay,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [{ locale }, data] = await Promise.all([getI18n(), getCategoryWithItems(slug)]);
  return { title: data ? categoryTitle(data.category, locale) : "Azkar" };
}

export default async function AzkarCategoryPage({ params }: Params) {
  const { slug } = await params;
  const { locale, dict } = await getI18n();
  const data = await getCategoryWithItems(slug);
  if (!data) notFound();

  const user = await getCurrentUser();
  let day = todayInTimezone("UTC");
  let progress: Record<number, { count: number; completed: boolean }> = {};
  let favoriteIds: number[] = [];
  let alreadyCompleted = false;
  let display = {
    // Arabic readers don't need the Latin transliteration or English translation by default.
    showTransliteration: locale !== "ar",
    showTranslation: locale !== "ar",
    arabicFontSize: 2,
  };

  if (user) {
    const settings = await getSettings(user.id);
    day = todayInTimezone(settings.timezone);
    display = {
      showTransliteration: locale === "ar" ? false : settings.showTransliteration,
      showTranslation: locale === "ar" ? false : settings.showTranslation,
      arabicFontSize: settings.arabicFontSize,
    };
    const [rows, favs, completions] = await Promise.all([
      getUserProgressForDay(user.id, slug, day),
      getFavoriteIds(user.id),
      getTodayCompletions(user.id, day),
    ]);
    for (const r of rows) progress[r.azkarId] = { count: r.count, completed: r.completed };
    favoriteIds = favs;
    alreadyCompleted = completions.includes(slug);
  }

  const { category, items } = data;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/azkar"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-night-700 hover:text-night-900"
      >
        <Icon name="chevron-left" className="h-4 w-4" /> {dict.home.allCategories}
      </Link>

      <header className="mx-auto mb-8 flex max-w-4xl items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-night-800 text-gold-300">
          <Icon name={category.icon as IconName} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-serif text-4xl font-semibold text-night-900">{categoryTitle(category, locale)}</h1>
          <p className={`text-2xl leading-snug text-night-600 ${locale === "ar" ? "" : "arabic"}`}>
            {locale === "ar" ? categoryDescription(category, locale) : category.titleArabic}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-night-600/80">{categoryDescription(category, locale)}</p>
          <p className="mt-2 text-xs text-night-600/60">{dict.azkar.tapHint}</p>
        </div>
      </header>

      <AzkarReader
        category={category}
        categoryLabel={categoryTitle(category, locale)}
        items={items}
        initialProgress={progress}
        favoriteIds={favoriteIds}
        isLoggedIn={!!user}
        day={day}
        alreadyCompleted={alreadyCompleted}
        locale={locale}
        display={display}
      />
    </main>
  );
}

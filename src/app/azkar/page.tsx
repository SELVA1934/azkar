import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { num } from "@/i18n";
import { todayInTimezone } from "@/lib/islamic";
import { categoryDescription, categoryTitle, getCategories, getTodayCategoryProgress, getTodayCompletions } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.azkar.title };
}
export const dynamic = "force-dynamic";

export default async function AzkarIndexPage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  const categories = await getCategories();

  let completions: string[] = [];
  let progress = new Map<string, number>();
  if (user) {
    const settings = await getSettings(user.id);
    const today = todayInTimezone(settings.timezone);
    [completions, progress] = await Promise.all([
      getTodayCompletions(user.id, today),
      getTodayCategoryProgress(user.id, today),
    ]);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{dict.azkar.kicker}</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-night-900">{dict.azkar.title}</h1>
        <p className="arabic mt-1 text-2xl text-night-600">الأذكار والأدعية</p>
        <p className="mt-2 max-w-2xl text-night-600/80">
          {dict.azkar.intro}
          {!user && ` ${dict.azkar.guestIntro}`}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const done = completions.includes(cat.slug);
          const itemsDone = progress.get(cat.slug) ?? 0;
          const pct = done ? 100 : Math.round((itemsDone / Math.max(cat.itemCount, 1)) * 100);
          const title = categoryTitle(cat, locale);
          const subtitle = locale === "ar" ? cat.title : cat.titleArabic;
          return (
            <Link
              key={cat.slug}
              href={`/azkar/${cat.slug}`}
              className={`card fade-up fade-delay-${Math.min(i % 4, 3)} group relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-glow`}
            >
              <div className="pattern-stars-light absolute -end-6 -top-6 h-32 w-32 rounded-full opacity-70" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      done ? "bg-night-800 text-gold-300" : "bg-cream-100 text-night-700 group-hover:bg-night-800 group-hover:text-gold-300"
                    } transition`}
                  >
                    <Icon name={done ? "check" : (cat.icon as IconName)} className="h-6 w-6" />
                  </span>
                  <span className="shrink-0 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-night-700">
                    {num(locale, cat.itemCount)} {cat.itemCount === 1 ? dict.common.item : dict.common.items}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-night-900">{title}</h2>
                <p className={`text-xl leading-snug text-night-600 ${locale === "ar" ? "" : "arabic"}`}>{subtitle}</p>
                <p className="mt-2 line-clamp-2 text-sm text-night-600/75">{categoryDescription(cat, locale)}</p>
                {user && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-night-600/70">
                      <span>{done ? dict.azkar.completedToday : itemsDone > 0 ? dict.azkar.inProgress : dict.azkar.notStarted}</span>
                      <span className="tabular-nums">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                      <div className={`h-full rounded-full ${done ? "bg-gold-500" : "bg-night-700"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

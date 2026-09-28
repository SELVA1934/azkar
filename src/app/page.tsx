import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { PrayerTimes } from "@/components/PrayerTimes";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { fmt, num, type Dict, type Locale } from "@/i18n";
import { DAYS_AR } from "@/i18n";
import { gregorianDate, hijriDate, suggestedCategory, todayInTimezone } from "@/lib/islamic";
import {
  categoryDescription,
  categoryTitle,
  getCategories,
  getStreakAndActivity,
  getTasbihStats,
  getTodayCategoryProgress,
  getTodayCompletions,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  if (!user) return <Landing locale={locale} dict={dict} />;
  return <Dashboard userId={user.id} name={user.name} locale={locale} dict={dict} />;
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

const DAILY_SLUGS = ["morning", "evening", "after-prayer", "sleep"] as const;

async function Dashboard({ userId, name, locale, dict }: { userId: number; name: string; locale: Locale; dict: Dict }) {
  const settings = await getSettings(userId);
  const tz = settings.timezone || "UTC";
  const today = todayInTimezone(tz);

  const [categories, completions, progress, activity, tasbih] = await Promise.all([
    getCategories(),
    getTodayCompletions(userId, today),
    getTodayCategoryProgress(userId, today),
    getStreakAndActivity(userId, today),
    getTasbihStats(userId, today),
  ]);

  const suggestion = suggestedCategory(tz);
  const suggestedCat = categories.find((c) => c.slug === suggestion.slug);
  const dailyCats = DAILY_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(Boolean) as typeof categories;
  const doneToday = dailyCats.filter((c) => completions.includes(c.slug)).length;

  // Locale-aware weekday labels for the 7-day strip.
  const weekdayLabel = (day: string) => {
    if (locale === "ar") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return day;
      const d = new Date(`${day}T00:00:00Z`).getUTCDay();
      if (!Number.isInteger(d) || d < 0 || d > 6) return day;
      const label = DAYS_AR.at(d);
      return typeof label === "string" ? label : day;
    }
    return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="card-dark pattern-stars fade-up relative overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300/80">{gregorianDate(locale, tz)}</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
              {fmt(dict.home.greeting[timeOfDay(tz)], { name: name.split(" ")[0] })}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-cream-100/70">
              <Icon name="crescent" className="h-4 w-4 text-gold-300" />
              {hijriDate(locale, tz)}
            </p>
          </div>
          {suggestedCat && (
            <Link
              href={`/azkar/${suggestedCat.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-gold-400/30 bg-white/5 px-5 py-4 transition hover:bg-white/10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                <Icon name={suggestedCat.icon as IconName} className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.15em] text-gold-300/80">{dict.home.recommended}</span>
                <span className="block font-semibold text-cream-50">
                  {completions.includes(suggestedCat.slug)
                    ? `${categoryTitle(suggestedCat, locale)} · ${dict.common.done} ✓`
                    : categoryTitle(suggestedCat, locale)}
                </span>
                <span className={`block text-lg leading-snug text-gold-200 ${locale === "ar" ? "arabic" : ""}`}>
                  {locale === "ar" ? suggestedCat.title : suggestedCat.titleArabic}
                </span>
              </span>
              <Icon name="arrow-right" className="ms-2 h-5 w-5 text-gold-300 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          )}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon="flame"
          label={dict.home.streak}
          value={`${num(locale, activity.streak)} ${activity.streak === 1 ? dict.common.day : dict.common.days}`}
          hint={activity.streak > 0 ? dict.home.streakHintOn : dict.home.streakHintOff}
          accent
        />
        <StatCard
          icon="check"
          label={dict.home.todayAzkar}
          value={`${num(locale, doneToday)}/${num(locale, dailyCats.length)}`}
          hint={dict.home.dailySetsCompleted}
        />
        <StatCard
          icon="beads"
          label={dict.home.dhikrToday}
          value={num(locale, tasbih.todayTotal)}
          hint={fmt(dict.home.allTime, { n: num(locale, tasbih.total) })}
        />
        <StatCard icon="star" label={dict.home.activeDays} value={num(locale, activity.activeDays)} hint={dict.home.inLastYear} />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-night-900">{dict.home.todayTitle}</h2>
              <p className="text-sm text-night-600/80">{dict.home.todayBody}</p>
            </div>
            <Link href="/azkar" className="shrink-0 text-sm font-semibold text-night-700 underline decoration-gold-400 underline-offset-4">
              {dict.home.allCategories}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dailyCats.map((cat, i) => {
              const done = completions.includes(cat.slug);
              const itemsDone = progress.get(cat.slug) ?? 0;
              const pct = done ? 100 : Math.round((itemsDone / Math.max(cat.itemCount, 1)) * 100);
              return (
                <Link
                  key={cat.slug}
                  href={`/azkar/${cat.slug}`}
                  className={`card fade-up fade-delay-${Math.min(i, 3)} group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-glow`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                          done ? "bg-night-800 text-gold-300" : "bg-cream-100 text-night-700"
                        }`}
                      >
                        <Icon name={done ? "check" : (cat.icon as IconName)} className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-night-900">{categoryTitle(cat, locale)}</h3>
                        <p className={`text-base leading-snug text-night-600 ${locale === "ar" ? "" : "arabic"}`}>
                          {locale === "ar" ? categoryDescription(cat, locale) : cat.titleArabic}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-night-600">
                      {done ? dict.common.done : `${num(locale, itemsDone)}/${num(locale, cat.itemCount)}`}
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                    <div
                      className={`h-full rounded-full transition-all ${done ? "bg-gold-500" : "bg-night-700"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="card mt-6 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-night-900">{dict.home.last7}</h3>
              <span className="text-xs text-night-600/70">
                {fmt(dict.home.setsCompletedOverall, { n: num(locale, activity.totalCompletions) })}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {activity.last7.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                      d.active
                        ? "border-gold-400 bg-night-800 text-gold-300"
                        : "border-cream-300 bg-cream-50 text-night-600/50"
                    }`}
                  >
                    {d.active ? <Icon name="check" className="h-4 w-4" /> : num(locale, Number(d.day.slice(-2)))}
                  </span>
                  <span className="text-[11px] text-night-600/70">{weekdayLabel(d.day)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <QuickLink href="/tasbih" icon="beads" label={dict.nav.tasbih} />
            <QuickLink href="/names" icon="star" label={dict.nav.names} />
            <QuickLink href="/qibla" icon="compass" label={dict.nav.qibla} />
            <QuickLink href="/favorites" icon="heart" label={dict.nav.favorites} />
          </div>
        </section>

        <aside>
          <h2 className="mb-4 font-serif text-2xl font-semibold text-night-900">{dict.home.prayerTimes}</h2>
          <PrayerTimes
            compact
            locale={locale}
            initial={{
              city: settings.city,
              country: settings.country,
              latitude: settings.latitude,
              longitude: settings.longitude,
              method: settings.calculationMethod,
              timezone: tz,
            }}
          />
        </aside>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: IconName;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className={`${accent ? "card-dark" : "card"} p-5`}>
      <div className="flex items-center gap-2">
        <Icon name={icon} className={`h-4 w-4 shrink-0 ${accent ? "text-gold-300" : "text-gold-600"}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-cream-100/70" : "text-night-600/80"}`}>
          {label}
        </span>
      </div>
      <p className={`mt-2 font-serif text-3xl font-semibold tabular-nums ${accent ? "text-cream-50" : "text-night-900"}`}>{value}</p>
      <p className={`mt-1 text-xs ${accent ? "text-cream-100/60" : "text-night-600/70"}`}>{hint}</p>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: IconName; label: string }) {
  return (
    <Link href={href} className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-glow">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream-100 text-night-700">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold text-night-800">{label}</span>
    </Link>
  );
}

/** Which greeting key applies right now in the given timezone. */
function timeOfDay(tz: string): "morning" | "afternoon" | "evening" {
  let hour = 12;
  try {
    hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hour12: false }).format(new Date()));
  } catch {
    // fall through to default
  }
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/* ------------------------------------------------------------------ */
/* Landing                                                             */
/* ------------------------------------------------------------------ */

function Landing({ locale, dict }: { locale: "en" | "ar"; dict: Dict }) {
  const features: { icon: IconName; title: string; body: string }[] = [
    { icon: "sunrise", title: dict.features.f1t, body: dict.features.f1b },
    { icon: "beads", title: dict.features.f2t, body: dict.features.f2b },
    { icon: "mosque", title: dict.features.f3t, body: dict.features.f3b },
    { icon: "compass", title: dict.features.f4t, body: dict.features.f4b },
    { icon: "flame", title: dict.features.f5t, body: dict.features.f5b },
    { icon: "star", title: dict.features.f6t, body: dict.features.f6b },
  ];

  return (
    <main>
      <section className="pattern-stars relative overflow-hidden bg-night-900 text-cream-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.18),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div className="fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-gold-200">
              <Icon name="crescent" className="h-3.5 w-3.5" /> {dict.home.heroBadge}
            </p>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.15] sm:text-6xl">
              {dict.home.heroTitle1}
              <br />
              <span className="text-gold-gradient">{dict.home.heroTitle2}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream-100/75">{dict.home.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-gold !px-6 !py-3.5 text-base">
                {dict.home.startFree} <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link href="/azkar" className="btn btn-outline !border-white/15 !bg-white/5 !px-6 !py-3.5 text-base !text-cream-50 hover:!bg-white/10">
                {dict.home.browseAzkar}
              </Link>
            </div>
            <p className="mt-4 text-xs text-cream-100/50">{dict.home.heroFine}</p>
          </div>

          <div className="fade-up fade-delay-2 relative">
            <div className="card-dark relative rounded-3xl p-8 shadow-glow sm:p-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold-300/80">Surah Ar-Ra&apos;d · 13:28</p>
              <p className="arabic mt-6 text-3xl leading-[2] text-cream-50 sm:text-4xl">
                أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
              </p>
              <p className={`mt-6 font-serif text-xl italic text-gold-200 ${locale === "ar" ? "not-italic" : ""}`}>
                {locale === "ar" ? "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" : "\u201cVerily, in the remembrance of Allah do hearts find rest.\u201d"}
              </p>
              <div className="ornament mt-8 flex text-xs uppercase tracking-[0.3em]">
                <Icon name="crescent" className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl font-semibold text-night-900">{dict.home.featuresTitle}</h2>
          <p className="mt-3 text-night-600/80">{dict.home.featuresBody}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className={`card fade-up fade-delay-${Math.min(i, 3)} p-6`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-night-800 text-gold-300">
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-night-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-night-600/80">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="card-dark pattern-stars flex flex-col items-center gap-6 rounded-3xl p-10 text-center">
          <p className="arabic text-3xl text-gold-200">{dict.home.ctaQuran}</p>
          <p className="max-w-xl font-serif text-2xl text-cream-50">
            {locale === "ar" ? "فَاذْكُرُونِي أَذْكُرْكُمْ" : "\u201cSo remember Me; I will remember you.\u201d"}{" "}
            <span className="text-gold-300">— {dict.home.ctaReference}</span>
          </p>
          <Link href="/register" className="btn btn-gold !px-7 !py-3.5 text-base">
            {dict.home.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}

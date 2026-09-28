import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Icon, type IconName } from "@/components/Icon";
import { SettingsForm } from "@/components/SettingsForm";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { num } from "@/i18n";
import { hijriDate, todayInTimezone } from "@/lib/islamic";
import {
  categoryTitle,
  getCategories,
  getCategoryCompletionCounts,
  getStreakAndActivity,
  getTasbihStats,
} from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.profile.title };
}
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const settings = await getSettings(user.id);
  const today = todayInTimezone(settings.timezone);
  const [activity, tasbih, categories, completionCounts] = await Promise.all([
    getStreakAndActivity(user.id, today),
    getTasbihStats(user.id, today),
    getCategories(),
    getCategoryCompletionCounts(user.id),
  ]);

  const memberSince = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));
  const maxCount = Math.max(1, ...Array.from(completionCounts.values()));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="card-dark pattern-stars flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold-500 font-serif text-3xl font-bold text-night-950">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-semibold text-cream-50">{user.name}</h1>
            <p className="truncate text-sm text-cream-100/70">{user.email}</p>
            <p className="mt-1 text-xs text-cream-100/50">
              {dict.profile.memberSince} {memberSince} · {hijriDate(locale, settings.timezone)}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn btn-outline !border-white/15 !bg-white/5 !text-cream-50 hover:!bg-white/10">
            <Icon name="logout" className="h-4 w-4" /> {dict.nav.signOut}
          </button>
        </form>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon="flame" label={dict.profile.streak} value={`${num(locale, activity.streak)} ${dict.common.days}`} />
        <Stat icon="check" label={dict.profile.setsCompleted} value={num(locale, activity.totalCompletions)} />
        <Stat icon="beads" label={dict.profile.totalDhikr} value={num(locale, tasbih.total)} />
        <Stat icon="star" label={dict.profile.activeDays} value={num(locale, activity.activeDays)} />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-serif text-2xl font-semibold text-night-900">{dict.profile.history}</h2>
          <p className="text-sm text-night-600/75">{dict.profile.historyBody}</p>
          <ul className="mt-5 space-y-3">
            {categories.map((cat) => {
              const n = completionCounts.get(cat.slug) ?? 0;
              return (
                <li key={cat.slug}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <Link
                      href={`/azkar/${cat.slug}`}
                      className="flex min-w-0 items-center gap-2 font-medium text-night-800 hover:text-night-950"
                    >
                      <Icon name={cat.icon as IconName} className="h-4 w-4 shrink-0 text-gold-600" />
                      <span className="truncate">{categoryTitle(cat, locale)}</span>
                    </Link>
                    <span className="shrink-0 tabular-nums text-night-600">
                      {num(locale, n)} {n === 1 ? dict.common.day : dict.common.days}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-200">
                    <div className="h-full rounded-full bg-night-700" style={{ width: `${(n / maxCount) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-cream-200 pt-5">
            <h3 className="text-sm font-semibold text-night-900">{dict.profile.last7}</h3>
            <div className="mt-3 flex gap-2">
              {activity.last7.map((d) => (
                <span key={d.day} title={d.day} className={`h-8 flex-1 rounded-md ${d.active ? "bg-gold-500" : "bg-cream-200"}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="card h-fit p-6">
          <h2 className="font-serif text-2xl font-semibold text-night-900">{dict.profile.preferences}</h2>
          <p className="text-sm text-night-600/75">{dict.profile.preferencesBody}</p>
          <SettingsForm locale={locale} settings={settings} />
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-night-600/80">
        <Icon name={icon} className="h-4 w-4 shrink-0 text-gold-600" /> {label}
      </div>
      <p className="mt-2 font-serif text-3xl font-semibold tabular-nums text-night-900">{value}</p>
    </div>
  );
}

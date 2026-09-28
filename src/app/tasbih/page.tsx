import type { Metadata } from "next";
import { Tasbih } from "@/components/Tasbih";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { todayInTimezone } from "@/lib/islamic";
import { getRecentTasbihSessions, getTasbihStats } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.tasbih.title };
}
export const dynamic = "force-dynamic";

export default async function TasbihPage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  let day = todayInTimezone("UTC");
  let sessions: Awaited<ReturnType<typeof getRecentTasbihSessions>> = [];
  let stats: Awaited<ReturnType<typeof getTasbihStats>> | null = null;

  if (user) {
    const settings = await getSettings(user.id);
    day = todayInTimezone(settings.timezone);
    [sessions, stats] = await Promise.all([getRecentTasbihSessions(user.id), getTasbihStats(user.id, day)]);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{dict.tasbih.kicker}</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-night-900">{dict.tasbih.title}</h1>
        <p className="arabic mt-1 text-2xl text-night-600">المسبحة الإلكترونية</p>
        <p className="mt-2 max-w-3xl text-night-600/80">{dict.tasbih.quote}</p>
      </header>

      <Tasbih locale={locale} isLoggedIn={!!user} day={day} sessions={sessions} stats={stats} />
    </main>
  );
}

import type { Metadata } from "next";
import { PrayerTimes } from "@/components/PrayerTimes";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.prayer.title };
}
export const dynamic = "force-dynamic";

export default async function PrayerTimesPage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  const settings = user ? await getSettings(user.id) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{dict.prayer.kicker}</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-night-900">{dict.prayer.title}</h1>
        <p className="arabic mt-1 text-2xl text-night-600">مواقيت الصلاة</p>
        <p className="mt-2 max-w-2xl text-night-600/80">{dict.prayer.quote}</p>
      </header>

      <PrayerTimes
        locale={locale}
        canSave={!!user}
        initial={{
          city: settings?.city ?? null,
          country: settings?.country ?? null,
          latitude: settings?.latitude ?? null,
          longitude: settings?.longitude ?? null,
          method: settings?.calculationMethod ?? 3,
          timezone: settings?.timezone ?? null,
        }}
      />
    </main>
  );
}

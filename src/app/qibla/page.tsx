import type { Metadata } from "next";
import { QiblaCompass } from "@/components/QiblaCompass";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.qibla.title };
}
export const dynamic = "force-dynamic";

export default async function QiblaPage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  const settings = user ? await getSettings(user.id) : null;
  const initial =
    settings?.latitude != null && settings?.longitude != null
      ? { lat: settings.latitude, lng: settings.longitude, label: settings.city ?? undefined }
      : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{dict.qibla.kicker}</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-night-900">{dict.qibla.title}</h1>
        <p className="arabic mt-1 text-2xl text-night-600">اتجاه القبلة</p>
      </header>
      <QiblaCompass locale={locale} initial={initial} />
    </main>
  );
}

import { arabicName, prayerName, type PrayerKey } from "@/lib/prayer";
import type { Locale } from "@/i18n";

/** Localized prayer label: Arabic names in Arabic, English + Arabic otherwise. */
export function PrayerLabel({
  prayer,
  names,
  locale,
}: {
  prayer: PrayerKey;
  names: Record<PrayerKey, string>;
  locale: Locale;
}) {
  const name = prayerName(names, prayer);
  if (locale === "ar") return name;
  return (
    <>
      {name} <span className="arabic text-sm text-night-600/70">{arabicName(prayer)}</span>
    </>
  );
}

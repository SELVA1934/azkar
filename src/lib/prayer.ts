import { num, type Locale } from "@/i18n";

export const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerKey = (typeof PRAYERS)[number];

export type Timings = Record<string, string>;
export type ApiResult = {
  timings: Timings;
  meta: { timezone: string; method?: { name?: string } };
  date: { readable: string; hijri: { day: string; month: { en: string }; year: string } };
};

export type NextPrayer = { name: PrayerKey; current: PrayerKey; countdown: string };

/** Arabic display name per prayer (static lookup — no branching). */
const ARABIC_NAMES: Record<PrayerKey, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export function arabicName(p: PrayerKey): string {
  return ARABIC_NAMES[p];
}

export function toMinutes(t: string) {
  const m = t.match(/(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function clean(t: string) {
  return t.replace(/\s*\([^)]*\)/, "").trim();
}

export function safeTiming(timings: Timings, key: PrayerKey): string {
  switch (key) {
    case "Fajr":
      return typeof timings.Fajr === "string" ? timings.Fajr : "";
    case "Sunrise":
      return typeof timings.Sunrise === "string" ? timings.Sunrise : "";
    case "Dhuhr":
      return typeof timings.Dhuhr === "string" ? timings.Dhuhr : "";
    case "Asr":
      return typeof timings.Asr === "string" ? timings.Asr : "";
    case "Maghrib":
      return typeof timings.Maghrib === "string" ? timings.Maghrib : "";
    case "Isha":
      return typeof timings.Isha === "string" ? timings.Isha : "";
    default:
      return "";
  }
}

export function prayerName(names: Record<PrayerKey, string>, p: PrayerKey): string {
  switch (p) {
    case "Fajr":
      return names.Fajr;
    case "Sunrise":
      return names.Sunrise;
    case "Dhuhr":
      return names.Dhuhr;
    case "Asr":
      return names.Asr;
    case "Maghrib":
      return names.Maghrib;
    case "Isha":
      return names.Isha;
    default:
      return p;
  }
}

function nowMinutesIn(tz: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const get = (k: string) => Number(parts.find((p) => p.type === k)?.value ?? 0);
    return get("hour") * 60 + get("minute") + get("second") / 60;
  } catch {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
  }
}

function countdownLabel(locale: Locale, diffMinutes: number): string {
  const h = Math.floor(diffMinutes / 60);
  const m = Math.floor(diffMinutes % 60);
  const s = Math.floor((diffMinutes * 60) % 60);
  const pad = (n: number) => (locale === "ar" ? num(locale, n) : String(n).padStart(2, "0"));
  return `${num(locale, h)}:${pad(m)}:${pad(s)}`;
}

export function todayDDMMYYYY() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

/** Pure next-prayer calculation (the ticking clock stays in the component). */
export function computeNextPrayer(data: ApiResult | null, locale: Locale): NextPrayer | null {
  if (!data) return null;
  const tz = typeof data.meta.timezone === "string" ? data.meta.timezone : "UTC";
  const now = nowMinutesIn(tz);
  const list = PRAYERS.filter((p) => p !== "Sunrise").map((p) => ({
    name: p,
    mins: toMinutes(clean(safeTiming(data.timings, p))),
  }));
  let upcoming = list.find((p) => p.mins > now);
  let diff: number;
  if (!upcoming) {
    const firstMins = list.at(0)?.mins ?? 0;
    upcoming = { name: "Fajr" as const, mins: firstMins + 24 * 60 };
    diff = upcoming.mins - now;
  } else {
    diff = upcoming.mins - now;
  }
  const current = [...list].reverse().find((p) => p.mins <= now)?.name ?? "Isha";
  return { name: upcoming.name, current, countdown: countdownLabel(locale, diff) };
}

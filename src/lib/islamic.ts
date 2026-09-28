/** Shared, isomorphic helpers (safe on server and client). */
import type { Locale } from "@/i18n";

const LOCALE_TAG: Record<Locale, string> = { en: "en-GB", ar: "ar-EG" };

export const KAABA = { lat: 21.422487, lng: 39.826206 };

/** YYYY-MM-DD for "now" in the given IANA timezone. */
export function todayInTimezone(timezone: string, date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    return `${get("year")}-${get("month")}-${get("day")}`;
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** Shift a YYYY-MM-DD string by n days (UTC arithmetic, safe for date-only strings). */
export function shiftDay(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

/** Human-readable Hijri date via ICU's Umm al-Qura calendar. */
export function hijriDate(locale: Locale, timezone = "UTC", date: Date = new Date()): string {
  try {
    const tag = locale === "ar" ? "ar-EG-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura-nu-latn";
    return new Intl.DateTimeFormat(tag, {
      timeZone: timezone,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

export function gregorianDate(locale: Locale, timezone = "UTC", date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat(LOCALE_TAG[locale] ?? "en-GB", {
      timeZone: timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

/** Great-circle initial bearing from (lat,lng) to the Kaaba, in degrees clockwise from true north. */
export function qiblaBearing(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lng - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Great-circle distance in km. */
export function distanceToKaabaKm(lat: number, lng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(KAABA.lat - lat);
  const dLng = toRad(KAABA.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Given a sorted-desc list of distinct YYYY-MM-DD days, compute current streak ending today or yesterday. */
export function computeStreak(days: string[], today: string): number {
  const set = new Set(days);
  let cursor = today;
  if (!set.has(cursor)) {
    cursor = shiftDay(today, -1);
    if (!set.has(cursor)) return 0;
  }
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

/** Which azkar category is most relevant right now, by hour in the user's timezone. */
export function suggestedCategory(timezone: string, date: Date = new Date()): { slug: string } {
  let hour = date.getUTCHours();
  try {
    hour = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hour12: false }).format(date),
    );
  } catch {
    // fall back to UTC
  }
  if (hour >= 4 && hour < 12) return { slug: "morning" };
  if (hour >= 12 && hour < 15) return { slug: "after-prayer" };
  if (hour >= 15 && hour < 20) return { slug: "evening" };
  return { slug: "sleep" };
}

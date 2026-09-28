import { DICTS, type Dict } from "./dictionaries";

export type { Dict } from "./dictionaries";

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "noor_lang";
export const LOCALE_STORAGE_KEY = "noor:lang";

export type LocaleDict = Dict;

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const v = value.trim().toLowerCase();
  if (v.startsWith("ar")) return "ar";
  if (v.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return isRTL(locale) ? "rtl" : "ltr";
}

export function getDict(locale: Locale): LocaleDict {
  const l: string = locale;
  if (l !== "en" && l !== "ar") return DICTS.en;
  if (locale === "ar") return DICTS.ar;
  return DICTS.en;
}

const FORBIDDEN_FMT_KEYS = new Set(["__proto__", "prototype", "constructor"]);
/** Simple {placeholder} interpolation. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    if (!k || FORBIDDEN_FMT_KEYS.has(k)) continue;
    if (typeof v !== "string" && typeof v !== "number") continue;
    if (!/^\w+$/.test(k)) continue;
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

/** Locale-aware digits: Arabic-Indic (٠١٢٣) in Arabic, Western otherwise. */
export function num(locale: Locale, value: number): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(value);
  } catch {
    return String(value);
  }
}

/** Locale-aware percent. */
export function pct(locale: Locale, value: number): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", { style: "percent" }).format(value / 100);
  } catch {
    return `${value}%`;
  }
}

/** Locale-aware date/time formatting. */
export function dateTime(
  locale: Locale,
  value: Date | string,
  opts: Intl.DateTimeFormatOptions,
  timezone?: string,
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
      ...opts,
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

/** Convert "HH:MM" (24h) into a locale-aware 12h string. */
export function time12(locale: Locale, time: string): string {
  const m = time.match(/(\d{1,2}):(\d{2})/);
  if (!m) return time;
  let h = Number(m[1]);
  const min = m[2];
  const suffix =
    locale === "ar" ? (h >= 12 ? "م" : "ص") : h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  const digits = locale === "ar" ? num(locale, hh) : String(hh);
  const mins = locale === "ar" ? num(locale, Number(min)) : min;
  return `${digits}:${mins} ${suffix}`;
}

export const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

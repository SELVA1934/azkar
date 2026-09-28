import "server-only";
import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { LOCALE_COOKIE, dirOf, getDict, normalizeLocale, type Locale, type LocaleDict } from "./index";

export type ServerI18n = { locale: Locale; dict: LocaleDict; dir: "rtl" | "ltr" };

/**
 * Resolves the active locale for the current request.
 * Priority: explicit cookie → saved account preference → Accept-Language hint → "en".
 *
 * Note we test cookie *presence* (`has`) rather than comparing against the
 * default locale. Otherwise an explicit "en" would be indistinguishable from
 * "no cookie set", and a user on an Arabic browser who switched to English
 * would be flipped straight back to Arabic by their Accept-Language header.
 */
export const getI18n = async (): Promise<ServerI18n> => {
  const store = await cookies();

  if (store.has(LOCALE_COOKIE)) {
    const cookieLocale = normalizeLocale(store.get(LOCALE_COOKIE)?.value);
    return { locale: cookieLocale, dict: getDict(cookieLocale), dir: dirOf(cookieLocale) };
  }

  // No explicit Arabic cookie: honour a saved account preference.
  const user = await getCurrentUser();
  if (user) {
    const [row] = await db
      .select({ language: userSettings.language })
      .from(userSettings)
      .where(eq(userSettings.userId, user.id))
      .limit(1);
    if (row?.language) {
      const saved = normalizeLocale(row.language);
      return { locale: saved, dict: getDict(saved), dir: dirOf(saved) };
    }
  }

  // Browser hint.
  const header = (await headers()).get("accept-language") ?? "";
  const hinted = normalizeLocale(header.split(",")[0]?.split("-")[0]);
  return { locale: hinted, dict: getDict(hinted), dir: dirOf(hinted) };
};

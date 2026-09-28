"use server";

import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "@/i18n";

/** Persist the chosen locale: cookie first (works for guests), then the account. */
export async function setLocaleAction(raw: string): Promise<{ ok: true; locale: Locale }> {
  const locale = normalizeLocale(raw);

  const h = await headers();
  const isHttps = (h.get("x-forwarded-proto") ?? "").includes("https");
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
  });

  const user = await getCurrentUser();
  if (user) {
    await db
      .insert(userSettings)
      .values({ userId: user.id, language: locale })
      .onConflictDoUpdate({ target: userSettings.userId, set: { language: locale, updatedAt: new Date() } });
  }

  // No revalidatePath needed: every page is `force-dynamic`, so the next
  // request reads the fresh cookie naturally.
  return { ok: true, locale };
}

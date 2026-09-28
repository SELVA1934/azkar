"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, userSettings } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";

export type AuthState = { error?: string; errorKey?: string } | undefined;

/** Maps an error key to a localized message; falls back to the raw error. */
const AUTH_ERRORS = {
  nameShort: "auth.nameShort",
  emailInvalid: "auth.emailInvalid",
  passwordShort: "auth.passwordShort",
  emailTaken: "auth.emailTaken",
  missing: "auth.missing",
  badCredentials: "auth.badCredentials",
} as const;
export type AuthErrorKey = keyof typeof AUTH_ERRORS;

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  if (email.includes(" ") || email.includes("\t") || email.includes("\n")) return false;
  const at = email.indexOf("@");
  if (at <= 0 || at !== email.lastIndexOf("@") || at === email.length - 1) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local || local.length > 64 || !domain || domain.length > 253) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  const dot = domain.indexOf(".");
  if (dot <= 0 || dot === domain.length - 1) return false;
  if (domain.includes("..")) return false;
  const tld = domain.slice(domain.lastIndexOf(".") + 1);
  if (tld.length < 2) return false;
  return true;
}

function cleanTimezone(tz: FormDataEntryValue | null): string {
  const value = typeof tz === "string" ? tz.trim() : "";
  if (!value) return "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    return "UTC";
  }
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const timezone = cleanTimezone(formData.get("timezone"));

  if (name.length < 2) return { error: AUTH_ERRORS.nameShort, errorKey: "nameShort" };
  if (!isValidEmail(email)) return { error: AUTH_ERRORS.emailInvalid, errorKey: "emailInvalid" };
  if (password.length < 8) return { error: AUTH_ERRORS.passwordShort, errorKey: "passwordShort" };

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) return { error: AUTH_ERRORS.emailTaken, errorKey: "emailTaken" };

  const passwordHash = await bcrypt.hash(password, 11);
  const [user] = await db.insert(users).values({ name, email, passwordHash }).returning({ id: users.id });

  await db.insert(userSettings).values({ userId: user.id, timezone }).onConflictDoNothing();
  await createSession(user.id);
  redirect("/");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const timezone = cleanTimezone(formData.get("timezone"));

  if (!isValidEmail(email) || !password) return { error: AUTH_ERRORS.missing, errorKey: "missing" };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) return { error: AUTH_ERRORS.badCredentials, errorKey: "badCredentials" };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: AUTH_ERRORS.badCredentials, errorKey: "badCredentials" };

  // Keep timezone fresh so daily tracking matches the user's local day.
  await db
    .insert(userSettings)
    .values({ userId: user.id, timezone })
    .onConflictDoUpdate({ target: userSettings.userId, set: { timezone, updatedAt: new Date() } });

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

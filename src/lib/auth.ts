import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { randomBytes } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, userSettings, type User, type UserSettings } from "@/db/schema";

export const SESSION_COOKIE = "noor_session";
const SESSION_DAYS = 30;

export type SafeUser = Pick<User, "id" | "name" | "email" | "createdAt">;

async function cookieOptions() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "";
  const isHttps = proto.includes("https");
  return {
    httpOnly: true,
    path: "/",
    sameSite: (isHttps ? "none" : "lax") as "none" | "lax",
    secure: isHttps,
  };
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ userId, token, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { ...(await cookieOptions()), expires: expiresAt });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  store.set(SESSION_COOKIE, "", { ...(await cookieOptions()), maxAge: 0 });
}

/** Cached per request. Returns the logged-in user or null. */
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return rows[0] ?? null;
});

export const getSettings = cache(async (userId: number): Promise<UserSettings> => {
  const rows = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  if (rows[0]) return rows[0];
  const [created] = await db
    .insert(userSettings)
    .values({ userId })
    .onConflictDoNothing()
    .returning();
  if (created) return created;
  const again = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  return again[0];
});

"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";
import { Icon } from "@/components/Icon";
import { getDict, type Dict, type Locale } from "@/i18n";

/** Errors returned by server actions as "auth.someKey" are localized here. */
function resolveError(dict: Dict, error: string): string {
  if (!error.startsWith("auth.")) return error;
  const key = error.slice("auth.".length);
  switch (key) {
    case "nameShort":
      return dict.auth.nameShort;
    case "emailInvalid":
      return dict.auth.emailInvalid;
    case "passwordShort":
      return dict.auth.passwordShort;
    case "emailTaken":
      return dict.auth.emailTaken;
    case "missing":
      return dict.auth.missing;
    case "badCredentials":
      return dict.auth.badCredentials;
    default:
      return error;
  }
}

export function AuthForm({ mode, locale }: { mode: "login" | "register"; locale: Locale }) {
  const dict = getDict(locale);
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined);
  const [timezone, setTimezone] = useState("UTC");

  // One-time client hydration: timezone is browser-only, so it must be read
  // in an effect (not a cascading render).
  /* eslint-disable react-hooks/set-state-in-effect -- one-time timezone hydration */
  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    } catch {
      setTimezone("UTC");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="card fade-up w-full max-w-md p-8 sm:p-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-gold-400/50 bg-night-900 shadow-glow">
          <Icon name="crescent" className="h-7 w-7 text-gold-300" />
        </span>
        <p className="arabic text-2xl text-night-700">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-night-900">
          {mode === "login" ? dict.auth.welcomeBack : dict.auth.createAccount}
        </h1>
        <p className="mt-2 text-sm text-night-600/80">{mode === "login" ? dict.auth.loginSub : dict.auth.registerSub}</p>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="timezone" value={timezone} />

        {mode === "register" && (
          <div>
            <label htmlFor="name" className="label">
              {dict.auth.name}
            </label>
            <input id="name" name="name" className="input" placeholder={dict.auth.namePlaceholder} autoComplete="name" required />
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            {dict.auth.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            {dict.auth.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            placeholder={mode === "register" ? dict.auth.passwordPlaceholder : "••••••••"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={mode === "register" ? 8 : undefined}
            required
          />
        </div>

        {state?.error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {resolveError(dict, state.error)}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full !py-3.5">
          {pending ? dict.auth.pleaseWait : mode === "login" ? dict.auth.signIn : dict.auth.create}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-night-600/80">
        {mode === "login" ? (
          <>
            {dict.auth.newHere}{" "}
            <Link href="/register" className="font-semibold text-night-800 underline decoration-gold-400 underline-offset-4">
              {dict.auth.createAccount}
            </Link>
          </>
        ) : (
          <>
            {dict.auth.haveAccount}{" "}
            <Link href="/login" className="font-semibold text-night-800 underline decoration-gold-400 underline-offset-4">
              {dict.auth.signIn}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

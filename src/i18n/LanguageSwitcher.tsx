"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setLocaleAction } from "@/app/actions/locale";
import type { Locale } from "./index";
import { useI18n } from "./provider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState(false);

  const working = pending || busy;

  /**
   * Switching locale must reload the document, not just refresh the route:
   * `<html lang dir>` lives outside the router's tree, so a soft refresh can
   * never flip the page between LTR and RTL. A full reload re-renders the
   * document with the correct direction.
   */
  const change = (next: Locale) => {
    if (next === locale || working) return;

    setBusy(true);
    start(async () => {
      const reload = () => {
        const { pathname, search, hash } = window.location;
        window.location.assign(pathname + search + hash);
      };

      try {
        await setLocaleAction(next);
      } catch {
        // The action also sets the cookie; if the round-trip failed, still
        // reload so we fall back to a consistent server-rendered state
        // rather than leaving a half-updated page behind.
        reload();
        return;
      }
      reload();
    });
  };

  void router;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => { change(locale === "ar" ? "en" : "ar"); }}
        disabled={working}
        title={dict.lang.switch}
        aria-label={dict.lang.switch}
        aria-busy={working}
        className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-cream-100/85 transition hover:border-gold-400/40 hover:text-gold-200 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
        {working ? "…" : locale === "ar" ? "EN" : "ع"}
      </button>
    );
  }

  return (
    <div>
      <span className="label">{dict.lang.choose}</span>
      <div className="grid grid-cols-2 gap-2">
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => { change(l); }}
            disabled={working}
            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
              locale === l ? "border-gold-400 bg-gold-100/60 text-night-900" : "border-cream-200 text-night-700 hover:border-gold-300"
            }`}
            aria-pressed={locale === l}
          >
            {l === "ar" ? "العربية" : "English"}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-night-600/70">{dict.lang.hint}</p>
    </div>
  );
}

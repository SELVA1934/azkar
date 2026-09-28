"use client";

import { useMemo, useState } from "react";
import { NAMES_OF_ALLAH } from "@/data/names";
import { Icon } from "@/components/Icon";
import { getDict, num, type Locale } from "@/i18n";

export function NamesGrid({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NAMES_OF_ALLAH.map((n, i) => ({ ...n, index: i + 1 })).filter((n) => {
      if (!q) return true;
      const western = String(n.index);
      // Also match Arabic-Indic digits so Arabic users can type ٤٥ and find #45.
      const arabicIndic = num(locale, n.index);
      return (
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        (locale === "ar" ? n.meaningArabic.includes(query.trim()) : false) ||
        n.arabic.includes(query.trim()) ||
        western === q ||
        arabicIndic === query.trim()
      );
    });
  }, [query, locale]);

  const selected = active != null ? NAMES_OF_ALLAH[active - 1] : null;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input sm:max-w-sm"
          placeholder={dict.names.searchPlaceholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); }}
          aria-label={dict.common.search}
        />
        <span className="shrink-0 text-sm text-night-600/70">
          {num(locale, filtered.length)} {dict.common.of} {num(locale, 99)}
        </span>
      </div>

      {selected && (
        <div className="card-dark pattern-stars fade-up relative mb-6 overflow-hidden p-8 text-center">
          <button
            onClick={() => { setActive(null); }}
            className="absolute end-4 top-4 rounded-full p-2 text-cream-100/60 hover:bg-white/5 hover:text-white"
            aria-label={dict.common.close}
          >
            ✕
          </button>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300/80">
            {dict.names.nameNumber.replace("{n}", num(locale, active ?? 0))}
          </p>
          <p className="arabic mt-3 text-6xl leading-[1.6] text-gold-gradient sm:text-7xl">{selected.arabic}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-cream-50">
            {locale === "ar" ? selected.meaningArabic : selected.transliteration}
          </p>
          <p className="mt-1 text-lg text-cream-100/75">
            {locale === "ar" ? selected.transliteration : selected.meaning}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => { setActive((a) => (a && a > 1 ? a - 1 : 99)); }}
              className="btn btn-outline !border-white/15 !bg-white/5 !py-2 !text-cream-50 hover:!bg-white/10"
            >
              <Icon name="chevron-left" className="h-4 w-4" /> {dict.common.previous}
            </button>
            <button
              onClick={() => { setActive((a) => (a && a < 99 ? a + 1 : 1)); }}
              className="btn btn-outline !border-white/15 !bg-white/5 !py-2 !text-cream-50 hover:!bg-white/10"
            >
              {dict.common.next} <Icon name="arrow-right" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((n) => (
          <li key={n.index}>
            <button
              onClick={() => {
                setActive(n.index);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`card group flex h-full w-full flex-col items-center p-4 text-center transition hover:-translate-y-0.5 hover:shadow-glow ${
                active === n.index ? "border-gold-400 shadow-glow" : ""
              }`}
            >
              <span className="self-start rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-night-700">
                {num(locale, n.index)}
              </span>
              <span className="arabic mt-1 text-3xl leading-[1.6] text-night-900 transition group-hover:text-night-700">{n.arabic}</span>
              <span className="mt-1 text-sm font-semibold text-night-900">
                {locale === "ar" ? n.meaningArabic : n.transliteration}
              </span>
              <span className="mt-0.5 text-xs text-night-600/75">{locale === "ar" ? n.transliteration : n.meaning}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/app/actions/azkar";
import { Icon } from "@/components/Icon";
import { getDict, num, type Locale } from "@/i18n";

type Item = {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  repeatCount: number;
  reference: string;
  virtue: string | null;
  virtueArabic: string | null;
  categorySlug: string;
  categoryTitle: string;
};

export function FavoriteCard({ item, fontSize, locale }: { item: Item; fontSize: number; locale: Locale }) {
  const dict = getDict(locale);
  const [removed, setRemoved] = useState(false);
  const [pending, start] = useTransition();
  const [showTranslit, setShowTranslit] = useState(true);
  const [showTrans, setShowTrans] = useState(true);

  if (removed) return null;

  const virtue = locale === "ar" && item.virtueArabic ? item.virtueArabic : item.virtue;

  return (
    <li className="card fade-up p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/azkar/${item.categorySlug}`}
          className="shrink-0 rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-night-700 hover:bg-gold-100"
        >
          {item.categoryTitle}
        </Link>
        <div className="flex items-center gap-1">
          {locale !== "ar" && (
            <>
              <button
                onClick={() => { setShowTranslit((v) => !v); }}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${showTranslit ? "bg-night-800 text-cream-50" : "bg-cream-100 text-night-700"}`}
                aria-pressed={showTranslit}
              >
                Aa
              </button>
              <button
                onClick={() => { setShowTrans((v) => !v); }}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${showTrans ? "bg-night-800 text-cream-50" : "bg-cream-100 text-night-700"}`}
                aria-pressed={showTrans}
              >
                EN
              </button>
            </>
          )}
          <button
            onClick={() => {
              start(async () => {
                setRemoved(true);
                await toggleFavorite(item.id);
              });
            }}
            disabled={pending}
            className="rounded-full p-2 text-red-500 transition hover:bg-red-50"
            aria-label={dict.favorites.remove}
            title={dict.favorites.remove}
          >
            <Icon name="heart-filled" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <p className={`arabic arabic-size-${Math.min(Math.max(fontSize, 1), 4)} mt-4 text-right text-night-900`}>{item.arabic}</p>

      {locale !== "ar" && showTranslit && <p className="mt-3 text-sm italic text-night-700/90">{item.transliteration}</p>}
      {locale !== "ar" && showTrans && <p className="mt-2 text-[15px] leading-relaxed text-night-800">{item.translation}</p>}
      {locale === "ar" && <p className="mt-3 text-sm leading-relaxed text-night-700/80">{item.reference}</p>}

      {virtue && (
        <p className="mt-3 flex gap-2 rounded-xl bg-cream-100/80 px-3 py-2 text-xs leading-relaxed text-night-700">
          <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
          <span>{virtue}</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-night-600/70">
        <span>{item.reference}</span>
        <span>
          {item.repeatCount > 1
            ? dict.common.repeatTimes.replace("{n}", num(locale, item.repeatCount))
            : dict.common.once}
        </span>
      </div>
    </li>
  );
}

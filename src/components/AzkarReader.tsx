"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  markCategoryComplete,
  resetCategoryProgress,
  saveZikrProgress,
  toggleFavorite,
  updateSettings,
} from "@/app/actions/azkar";
import type { Azkar, AzkarCategory } from "@/db/schema";
import { Icon } from "@/components/Icon";
import { getDict, num, type Locale } from "@/i18n";

type ProgressMap = Record<number, { count: number; completed: boolean } | undefined>;

type Props = {
  category: AzkarCategory;
  categoryLabel: string;
  items: Azkar[];
  initialProgress: ProgressMap;
  favoriteIds: number[];
  isLoggedIn: boolean;
  day: string;
  alreadyCompleted: boolean;
  locale: Locale;
  display: { showTransliteration: boolean; showTranslation: boolean; arabicFontSize: number };
};

export function AzkarReader({
  category,
  categoryLabel,
  items,
  initialProgress,
  favoriteIds,
  isLoggedIn,
  day,
  alreadyCompleted,
  locale,
  display,
}: Props) {
  const dict = getDict(locale);
  const [progress, setProgress] = useState<ProgressMap>(() => {
    const p: ProgressMap = {};
    for (const it of items) p[it.id] = initialProgress[it.id] ?? { count: 0, completed: false };
    return p;
  });
  const [favs, setFavs] = useState<Set<number>>(() => new Set(favoriteIds));
  const [showTranslit, setShowTranslit] = useState(display.showTransliteration);
  const [showTrans, setShowTrans] = useState(display.showTranslation);
  const [fontSize, setFontSize] = useState(display.arabicFontSize);
  const [focusMode, setFocusMode] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [celebrated, setCelebrated] = useState(alreadyCompleted);
  const [pulseId, setPulseId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const completeSent = useRef(alreadyCompleted);

  const completedCount = useMemo(() => items.filter((i) => progress[i.id]?.completed).length, [items, progress]);
  const allDone = completedCount === items.length && items.length > 0;
  const pct = Math.round((completedCount / Math.max(items.length, 1)) * 100);

  // Persist (debounced), immediately once a zikr is completed
  const persist = useCallback(
    (id: number, count: number, completed: boolean, immediate: boolean) => {
      if (!isLoggedIn) return;
      if (!Number.isInteger(id)) return;
      const existing = timers.current.get(id);
      if (existing !== undefined) {
        clearTimeout(existing);
      }
      const run = () => {
        void saveZikrProgress({ azkarId: id, categorySlug: category.slug, day, count, completed });
      };
      if (immediate) {
        run();
      } else {
        timers.current.set(id, setTimeout(run, 700));
      }
    },
    [isLoggedIn, category.slug, day],
  );

  useEffect(() => {
    if (allDone && !completeSent.current) {
      completeSent.current = true;
      setCelebrated(true);
      if (isLoggedIn) void markCategoryComplete(category.slug, day);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([40, 60, 40]);
    }
  }, [allDone, isLoggedIn, category.slug, day]);

  const increment = useCallback(
    (item: Azkar) => {
      setProgress((prev) => {
        const cur = prev[item.id] ?? { count: 0, completed: false };
        if (cur.completed) return prev;
        const nextCount = Math.min(cur.count + 1, item.repeatCount);
        const completed = nextCount >= item.repeatCount;
        persist(item.id, nextCount, completed, completed);
        return { ...prev, [item.id]: { count: nextCount, completed } };
      });
      setPulseId(item.id);
      setTimeout(() => { setPulseId((p) => (p === item.id ? null : p)); }, 450);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(12);
    },
    [persist],
  );

  // Focus mode advances automatically once an item is finished
  useEffect(() => {
    if (!focusMode) return;
    if (!Number.isInteger(focusIndex) || focusIndex < 0 || focusIndex >= items.length) return;
    const current = items.at(focusIndex);
    if (current && progress[current.id]?.completed) {
      const nextIdx = items.findIndex((it, idx) => idx > focusIndex && !progress[it.id]?.completed);
      if (nextIdx !== -1) {
        const t = setTimeout(() => { setFocusIndex(nextIdx); }, 650);
        return () => { clearTimeout(t); };
      }
    }
    return undefined;
  }, [focusMode, focusIndex, items, progress]);

  const reset = async () => {
    const empty: ProgressMap = {};
    for (const it of items) empty[it.id] = { count: 0, completed: false };
    setProgress(empty);
    setCelebrated(false);
    completeSent.current = false;
    setFocusIndex(0);
    if (isLoggedIn) await resetCategoryProgress(category.slug, day);
  };

  const onToggleFav = async (id: number) => {
    if (!isLoggedIn) return;
    if (!Number.isInteger(id)) return;
    setFavs((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
    const res = await toggleFavorite(id);
    if (res.ok) {
      setFavs((prev) => {
        const n = new Set(prev);
        if (res.favorited) n.add(id);
        else n.delete(id);
        return n;
      });
    }
  };

  const share = async (item: Azkar) => {
    const text =
      locale === "ar" ? `${item.arabic}\n\n${item.reference}` : `${item.arabic}\n\n${item.translation}\n\n— ${item.reference}`;
    try {
      if (typeof navigator !== "undefined" && "share" in navigator && typeof navigator.share === "function") {
        await navigator.share({ title: categoryLabel, text });
      } else if (typeof navigator !== "undefined" && "clipboard" in navigator) {
        await navigator.clipboard.writeText(text);
        setCopiedId(item.id);
        setTimeout(() => { setCopiedId(null); }, 1500);
      }
    } catch {
      // user cancelled
    }
  };

  const saveDisplay = (patch: Partial<{ showTransliteration: boolean; showTranslation: boolean; arabicFontSize: number }>) => {
    if (isLoggedIn) void updateSettings(patch);
  };

  const safeFocusIndex = Number.isInteger(focusIndex) ? Math.min(Math.max(focusIndex, 0), Math.max(items.length - 1, 0)) : 0;
  const focusItem = items.at(safeFocusIndex);
  const visibleItems = focusMode && focusItem ? [focusItem] : items;

  return (
    <div>
      {/* Sticky progress + controls */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-cream-200 bg-cream-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <div className="flex min-w-[180px] flex-1 items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-gold-500" : "bg-night-700"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums text-night-800">
              {num(locale, completedCount)}/{num(locale, items.length)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setFocusMode((f) => !f); }}
              className={`btn !px-3 !py-1.5 text-xs ${focusMode ? "btn-primary" : "btn-outline"}`}
              title={locale === "ar" ? "وضع التركيز: ذكر واحد في كل مرة" : "Focus mode: one zikr at a time"}
            >
              {focusMode ? dict.azkar.list : dict.azkar.focus}
            </button>
            {locale !== "ar" && (
              <button
                onClick={() => {
                  setShowTranslit((v) => {
                    saveDisplay({ showTransliteration: !v });
                    return !v;
                  });
                }}
                className={`btn !px-3 !py-1.5 text-xs ${showTranslit ? "btn-primary" : "btn-outline"}`}
                title={dict.profile.showTranslit}
              >
                {dict.azkar.translit}
              </button>
            )}
            {locale !== "ar" && (
              <button
                onClick={() => {
                  setShowTrans((v) => {
                    saveDisplay({ showTranslation: !v });
                    return !v;
                  });
                }}
                className={`btn !px-3 !py-1.5 text-xs ${showTrans ? "btn-primary" : "btn-outline"}`}
                title={dict.profile.showTranslation}
              >
                EN
              </button>
            )}
            <div className="flex items-center overflow-hidden rounded-full border border-cream-300 bg-white">
              <button
                onClick={() => {
                  setFontSize((s) => {
                    const n = Math.max(1, s - 1);
                    saveDisplay({ arabicFontSize: n });
                    return n;
                  });
                }}
                className="px-2.5 py-1.5 text-night-700 hover:bg-cream-100"
                aria-label={dict.azkar.smallerText}
              >
                <Icon name="minus" className="h-3.5 w-3.5" />
              </button>
              <span className="arabic px-1 text-sm leading-none text-night-700">ع</span>
              <button
                onClick={() => {
                  setFontSize((s) => {
                    const n = Math.min(4, s + 1);
                    saveDisplay({ arabicFontSize: n });
                    return n;
                  });
                }}
                className="px-2.5 py-1.5 text-night-700 hover:bg-cream-100"
                aria-label={dict.azkar.largerText}
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
              </button>
            </div>
            <button onClick={() => { void reset(); }} className="btn btn-ghost !px-2.5 !py-1.5" title={dict.azkar.resetProgress} aria-label={dict.common.reset}>
              <Icon name="reset" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        {celebrated && allDone && (
          <div className="card-dark pattern-stars fade-up mb-6 flex flex-col items-center gap-3 p-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-night-950">
              <Icon name="check" className="h-7 w-7" />
            </span>
            <p className="arabic text-2xl text-gold-200">{dict.azkar.completedPraise}</p>
            <p className="font-serif text-2xl font-semibold text-cream-50">
              {dict.azkar.completedHeading.replace("{title}", categoryLabel)}
            </p>
            <p className="max-w-md text-sm text-cream-100/70">
              {isLoggedIn ? dict.azkar.completedBodySaved : dict.azkar.completedBodyGuest}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link href="/azkar" className="btn btn-gold !py-2.5">
                {dict.common.more}
              </Link>
              <Link href="/" className="btn btn-outline !border-white/15 !bg-white/5 !py-2.5 !text-cream-50 hover:!bg-white/10">
                {dict.common.dashboard}
              </Link>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <p className="mb-6 rounded-2xl border border-gold-300 bg-gold-100/60 px-4 py-3 text-sm text-night-800">
            {dict.azkar.guestBanner}{" "}
            <Link href="/login" className="font-semibold underline decoration-gold-500 underline-offset-4">
              {dict.azkar.guestBannerLink}
            </Link>
          </p>
        )}

        {focusMode && (
          <div className="mb-4 flex items-center justify-between text-sm text-night-600/80">
            <button
              onClick={() => { setFocusIndex((i) => Math.max(0, i - 1)); }}
              disabled={focusIndex === 0}
              className="btn btn-ghost !px-3 !py-1.5 disabled:opacity-40"
            >
              <Icon name="chevron-left" className="h-4 w-4" /> {dict.common.previous}
            </button>
            <span className="font-semibold tabular-nums">
              {num(locale, focusIndex + 1)} {dict.common.of} {num(locale, items.length)}
            </span>
            <button
              onClick={() => { setFocusIndex((i) => Math.min(items.length - 1, i + 1)); }}
              disabled={focusIndex >= items.length - 1}
              className="btn btn-ghost !px-3 !py-1.5 disabled:opacity-40"
            >
              {dict.common.next} <Icon name="arrow-right" className="h-4 w-4" />
            </button>
          </div>
        )}

        <ol className="space-y-5">
          {visibleItems.map((item) => {
            const p = progress[item.id] ?? { count: 0, completed: false };
            const idx = items.indexOf(item);
            const remaining = item.repeatCount - p.count;
            const itemPct = Math.round((p.count / item.repeatCount) * 100);
            const isFav = favs.has(item.id);
            const virtue = locale === "ar" && item.virtueArabic ? item.virtueArabic : item.virtue;
            return (
              <li
                key={item.id}
                className={`card fade-up relative overflow-hidden transition ${
                  p.completed ? "border-gold-400/70 bg-gradient-to-br from-white to-gold-100/40" : ""
                }`}
              >
                {!p.completed && item.repeatCount > 1 && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-cream-200">
                    <div className="h-full bg-night-700 transition-all" style={{ width: `${itemPct}%` }} />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-7">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-night-600/70">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream-100 text-[11px] tabular-nums text-night-800">
                      {num(locale, idx + 1)}
                    </span>
                    <span className="truncate">{item.reference}</span>
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => { void share(item); }}
                      className="rounded-full p-2 text-night-600/70 transition hover:bg-cream-100 hover:text-night-900"
                      aria-label={dict.common.share}
                      title={copiedId === item.id ? dict.common.copied : dict.common.share}
                    >
                      <Icon name="share" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { void onToggleFav(item.id); }}
                      className={`rounded-full p-2 transition hover:bg-cream-100 ${
                        isFav ? "text-red-500" : "text-night-600/70 hover:text-night-900"
                      }`}
                      aria-label={isFav ? dict.azkar.removeFavorite : dict.azkar.addFavorite}
                      title={isLoggedIn ? (isFav ? dict.azkar.removeFavorite : dict.azkar.addFavorite) : dict.azkar.signInFavorites}
                      disabled={!isLoggedIn}
                    >
                      <Icon name={isFav ? "heart-filled" : "heart"} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { increment(item); }}
                  className={`block w-full px-5 pb-4 pt-4 text-right sm:px-7 ${p.completed ? "cursor-default" : "cursor-pointer active:bg-cream-50/70"}`}
                  aria-label={locale === "ar" ? "اضغط للعدّ" : "Tap to count"}
                >
                  <p className={`arabic arabic-size-${fontSize} text-night-900`}>{item.arabic}</p>
                </button>

                <div className="px-5 pb-5 sm:px-7">
                  {locale !== "ar" && showTranslit && (
                    <p className="text-sm italic leading-relaxed text-night-700/90">{item.transliteration}</p>
                  )}
                  {locale !== "ar" && showTrans && (
                    <p className="mt-2 text-[15px] leading-relaxed text-night-800">{item.translation}</p>
                  )}
                  {virtue && (
                    <p className={`mt-3 flex gap-2 rounded-xl bg-cream-100/80 px-3 py-2 text-xs leading-relaxed text-night-700 ${locale === "ar" ? "text-right" : ""}`}>
                      <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                      <span>{virtue}</span>
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-night-600/70">
                      {item.repeatCount > 1
                        ? dict.common.repeatTimes.replace("{n}", num(locale, item.repeatCount))
                        : dict.common.once}
                      {!p.completed && item.repeatCount > 1 && remaining < item.repeatCount
                        ? ` · ${dict.common.left.replace("{n}", num(locale, remaining))}`
                        : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => { increment(item); }}
                      disabled={p.completed}
                      className={`relative grid h-16 w-16 shrink-0 place-items-center rounded-full font-semibold tabular-nums shadow-soft transition ${
                        p.completed ? "bg-gold-500 text-night-950" : "bg-night-800 text-cream-50 hover:bg-night-700 active:scale-95"
                      } ${pulseId === item.id ? "tap-pulse" : ""}`}
                      aria-label={locale === "ar" ? "اضغط للعدّ" : "Tap to count"}
                    >
                      {p.completed ? (
                        <Icon name="check" className="h-7 w-7" />
                      ) : (
                        <span className="flex flex-col items-center leading-none">
                          <span className="text-xl">{num(locale, p.count)}</span>
                          <span className="mt-0.5 text-[10px] opacity-60">/{num(locale, item.repeatCount)}</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

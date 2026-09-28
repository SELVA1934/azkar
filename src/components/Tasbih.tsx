"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { deleteTasbihSession, saveTasbihSession } from "@/app/actions/azkar";
import { TASBIH_PRESETS } from "@/data/names";
import type { TasbihSession } from "@/db/schema";
import { Icon } from "@/components/Icon";
import { dateTime, fmt, getDict, num, type Locale } from "@/i18n";

type Preset = { phrase: string; arabic: string; meaning: string; meaningArabic: string; target: number };
const LS_KEY = "noor:tasbih";

export function Tasbih({
  locale,
  isLoggedIn,
  day,
  sessions,
  stats,
}: {
  locale: Locale;
  isLoggedIn: boolean;
  day: string;
  sessions: TasbihSession[];
  stats: { total: number; sessions: number; todayTotal: number } | null;
}) {
  const dict = getDict(locale);
  const [preset, setPreset] = useState<Preset>(TASBIH_PRESETS[0]);
  const [target, setTarget] = useState<number>(TASBIH_PRESETS[0].target);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [custom, setCustom] = useState("");
  const [pulse, setPulse] = useState(false);
  const [sound, setSound] = useState(false);
  const [saving, startSaving] = useTransition();
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const restored = useRef(false);

  // Restore an unfinished session (one-time hydration from localStorage,
  // not a cascading render).
  /* eslint-disable react-hooks/set-state-in-effect -- one-time session restore */
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw) as { preset: Preset; target: number; count: number; rounds: number };
        setPreset(s.preset);
        setTarget(s.target);
        setCount(s.count);
        setRounds(s.rounds);
      }
    } catch {
      // ignore
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ preset, target, count, rounds }));
    } catch {
      // ignore
    }
  }, [preset, target, count, rounds]);

  const beep = useCallback(
    (freq = 660, dur = 0.06) => {
      if (!sound) return;
      try {
        const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
        const Ctx = w.AudioContext ?? w.webkitAudioContext;
        if (!Ctx) return;
        audioCtx.current ??= new Ctx();
        const ctx = audioCtx.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        // ignore
      }
    },
    [sound],
  );

  const vibrateSafe = (pattern: number | number[]) => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore - vibration not available
    }
  };

  const tap = useCallback(() => {
    setPulse(true);
    setTimeout(() => { setPulse(false); }, 450);
    setCount((c) => {
      const next = c + 1;
      if (next >= target) {
        setRounds((r) => r + 1);
        vibrateSafe([50, 40, 50]);
        beep(880, 0.15);
        return 0;
      }
      vibrateSafe(10);
      beep();
      return next;
    });
  }, [target, beep]);

  // Space / Enter to count
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (target && ["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); };
  }, [tap]);

  const totalThisSession = rounds * target + count;

  const choosePreset = (p: Preset) => {
    setPreset(p);
    setTarget(p.target);
    setCount(0);
    setRounds(0);
    setCustom("");
  };

  const applyCustom = () => {
    const phrase = custom.trim();
    if (!phrase) return;
    setPreset({ phrase, arabic: phrase, meaning: dict.tasbih.customLabel, meaningArabic: dict.tasbih.customLabel, target });
    setCount(0);
    setRounds(0);
  };

  const resetAll = () => {
    setCount(0);
    setRounds(0);
  };

  const undo = () => {
    setCount((c) => {
      if (c > 0) return c - 1;
      if (rounds > 0) {
        setRounds((r) => r - 1);
        return target - 1;
      }
      return 0;
    });
  };

  const save = () => {
    if (!isLoggedIn || totalThisSession === 0) return;
    startSaving(async () => {
      const res = await saveTasbihSession({
        phrase: preset.phrase,
        phraseArabic: preset.arabic,
        count: totalThisSession,
        target,
        day,
      });
      if (res.ok) {
        setSavedMsg(fmt(dict.tasbih.savedMsg, { n: num(locale, totalThisSession), phrase: preset.phrase }));
        setCount(0);
        setRounds(0);
        setTimeout(() => { setSavedMsg(null); }, 2500);
      }
    });
  };

  const ring = 2 * Math.PI * 54;
  const ringOffset = ring - (count / Math.max(target, 1)) * ring;
  const presetMeaning = locale === "ar" ? preset.meaningArabic : preset.meaning;
  const presetName = locale === "ar" ? preset.arabic : preset.phrase;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <div className="card-dark pattern-stars relative overflow-hidden p-6 sm:p-8">
          <div className="text-center">
            <p className="arabic text-3xl leading-[1.8] text-gold-200 sm:text-4xl">{preset.arabic}</p>
            {locale !== "ar" && <p className="mt-1 font-serif text-xl text-cream-50">{preset.phrase}</p>}
            <p className="mt-1 text-sm text-cream-100/60">{presetMeaning}</p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <button
              type="button"
              onClick={tap}
              className={`relative grid h-64 w-64 select-none place-items-center rounded-full bg-gradient-to-b from-night-700 to-night-950 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] outline-none transition active:scale-[0.97] sm:h-72 sm:w-72 ${pulse ? "tap-pulse" : ""}`}
              aria-label={locale === "ar" ? "اضغط للعدّ" : "Tap to count"}
            >
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(201,162,39,0.18)" strokeWidth="3" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#d4ab3d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={ring}
                  strokeDashoffset={ringOffset}
                  className="transition-[stroke-dashoffset] duration-200"
                />
              </svg>
              <span className="flex flex-col items-center">
                <span className="font-serif text-7xl font-semibold tabular-nums text-cream-50 sm:text-8xl">{num(locale, count)}</span>
                <span className="text-sm tracking-widest text-gold-300/80">
                  {dict.common.of} {num(locale, target)}
                </span>
              </span>
            </button>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-center text-cream-100/80">
              <div>
                <p className="text-2xl font-semibold tabular-nums text-cream-50">{num(locale, rounds)}</p>
                <p className="text-[11px] uppercase tracking-widest">{dict.tasbih.rounds}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-semibold tabular-nums text-cream-50">{num(locale, totalThisSession)}</p>
                <p className="text-[11px] uppercase tracking-widest">{dict.tasbih.thisSession}</p>
              </div>
              {stats && (
                <>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-2xl font-semibold tabular-nums text-cream-50">{num(locale, stats.todayTotal)}</p>
                    <p className="text-[11px] uppercase tracking-widest">{dict.tasbih.savedToday}</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={undo} className="btn btn-outline !border-white/15 !bg-white/5 !py-2 !text-cream-50 hover:!bg-white/10">
                <Icon name="minus" className="h-4 w-4" /> {dict.tasbih.undo}
              </button>
              <button onClick={resetAll} className="btn btn-outline !border-white/15 !bg-white/5 !py-2 !text-cream-50 hover:!bg-white/10">
                <Icon name="reset" className="h-4 w-4" /> {dict.common.reset}
              </button>
              <button
                onClick={() => { setSound((s) => !s); }}
                className={`btn !py-2 ${sound ? "btn-gold" : "btn-outline !border-white/15 !bg-white/5 !text-cream-50 hover:!bg-white/10"}`}
              >
                {sound ? dict.tasbih.soundOn : dict.tasbih.soundOff}
              </button>
              {isLoggedIn ? (
                <button onClick={save} disabled={saving || totalThisSession === 0} className="btn btn-gold !py-2">
                  {saving ? dict.common.saving : dict.tasbih.saveSession}
                </button>
              ) : (
                <Link href="/login" className="btn btn-gold !py-2">
                  {dict.tasbih.signInToSave}
                </Link>
              )}
            </div>
            {savedMsg && <p className="mt-3 text-sm text-gold-200">{savedMsg} ✓</p>}
            <p className="mt-4 text-[11px] text-cream-100/40">{dict.tasbih.keyboardTip}</p>
          </div>
        </div>
      </section>

      <aside className="space-y-6 lg:col-span-2">
        <div className="card p-5">
          <h3 className="font-semibold text-night-900">{dict.tasbih.choose}</h3>
          <ul className="mt-3 grid grid-cols-1 gap-2">
            {TASBIH_PRESETS.map((p) => (
              <li key={p.phrase}>
                <button
                  onClick={() => { choosePreset(p); }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-start transition ${
                    preset.phrase === p.phrase
                      ? "border-gold-400 bg-gold-100/50"
                      : "border-cream-200 hover:border-gold-300 hover:bg-cream-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-night-900">{locale === "ar" ? p.meaningArabic : p.phrase}</span>
                    <span className="block truncate text-xs text-night-600/70">{locale === "ar" ? p.phrase : p.meaning}</span>
                  </span>
                  <span className="arabic shrink-0 text-lg text-night-700">{p.arabic}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-cream-200 pt-4">
            <label className="label" htmlFor="custom">
              {dict.tasbih.custom}
            </label>
            <div className="flex gap-2">
              <input id="custom" className="input" value={custom} onChange={(e) => { setCustom(e.target.value); }} placeholder={dict.tasbih.customPlaceholder} />
              <button onClick={applyCustom} className="btn btn-outline shrink-0">
                {dict.common.set}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="label">{dict.tasbih.target}</label>
            <div className="flex flex-wrap gap-2">
              {[33, 99, 100, 500, 1000].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTarget(t);
                    setCount(0);
                    setRounds(0);
                  }}
                  className={`btn !px-3.5 !py-1.5 text-xs ${target === t ? "btn-primary" : "btn-outline"}`}
                >
                  {num(locale, t)}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={100000}
                value={target}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(100000, Number(e.target.value) || 1));
                  setTarget(v);
                  setCount(0);
                }}
                className="input !w-24 !py-1.5 text-sm"
                aria-label={dict.tasbih.target}
              />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-night-900">{dict.tasbih.recent}</h3>
            {stats && (
              <span className="text-xs text-night-600/70">{fmt(dict.tasbih.totalDhikr, { n: num(locale, stats.total) })}</span>
            )}
          </div>
          {!isLoggedIn ? (
            <p className="mt-3 text-sm text-night-600/70">{dict.tasbih.signInHistory}</p>
          ) : sessions.length === 0 ? (
            <p className="mt-3 text-sm text-night-600/70">{dict.tasbih.noSessions}</p>
          ) : (
            <ul className="mt-3 divide-y divide-cream-200">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-night-900">
                      {num(locale, s.count)} × {locale === "ar" ? s.phraseArabic : s.phrase}
                    </p>
                    <p className="text-xs text-night-600/70">
                      {dateTime(locale, s.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <form action={() => void deleteTasbihSession(s.id)}>
                    <button
                      type="submit"
                      className="shrink-0 rounded-full p-2 text-night-600/50 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={dict.common.remove}
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

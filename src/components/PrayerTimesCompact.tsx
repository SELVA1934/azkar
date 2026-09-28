"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PrayerLabel } from "@/components/PrayerLabel";
import { time12, type Locale, type LocaleDict } from "@/i18n";
import { clean, PRAYERS, prayerName, safeTiming, type ApiResult, type NextPrayer } from "@/lib/prayer";

export function PrayerTimesCompact({
  dict,
  locale,
  data,
  loading,
  error,
  next,
  hasLocation,
  locationLabel,
  locating,
  onUseLocation,
}: {
  dict: LocaleDict;
  locale: Locale;
  data: ApiResult | null;
  loading: boolean;
  error: string | null;
  next: NextPrayer | null;
  hasLocation: boolean;
  locationLabel: string;
  locating: boolean;
  onUseLocation: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      {!hasLocation ? (
        <div className="p-6 text-center">
          <Icon name="location" className="mx-auto h-8 w-8 text-gold-500" />
          <p className="mt-3 text-sm text-night-600/80">{dict.prayer.locationPrompt}</p>
          <button onClick={onUseLocation} disabled={locating} className="btn btn-primary mt-4 !py-2.5">
            {locating ? dict.prayer.locating : dict.prayer.useLocation}
          </button>
          <Link href="/prayer-times" className="mt-3 block text-xs font-semibold text-night-700 underline decoration-gold-400 underline-offset-4">
            {dict.prayer.setLocation}
          </Link>
        </div>
      ) : (
        <>
          {next && data && (
            <div className="card-dark rounded-none border-0 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300/80">{dict.prayer.next}</p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div>
                  <p className="font-serif text-3xl font-semibold text-cream-50">{prayerName(dict.prayer.names, next.name)}</p>
                  <p className="arabic text-lg leading-tight text-gold-200">{next.name}</p>
                </div>
                <p className="text-end">
                  <span className="block text-2xl font-semibold tabular-nums text-cream-50">
                    {time12(locale, clean(safeTiming(data.timings, next.name)))}
                  </span>
                  <span className="block text-xs tabular-nums text-cream-100/60">
                    {dict.prayer.in} {next.countdown}
                  </span>
                </p>
              </div>
            </div>
          )}
          <ul className="divide-y divide-cream-200">
            {loading && !data && <li className="p-4 text-sm text-night-600/70">{dict.common.loading}</li>}
            {error && <li className="p-4 text-sm text-red-700">{error}</li>}
            {data &&
              PRAYERS.map((p) => (
                <li
                  key={p}
                  className={`flex items-center justify-between gap-3 px-5 py-2.5 text-sm ${
                    next?.current === p ? "bg-gold-100/60 font-semibold text-night-900" : "text-night-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <PrayerLabel prayer={p} names={dict.prayer.names} locale={locale} />
                  </span>
                  <span className="shrink-0 tabular-nums">{time12(locale, clean(safeTiming(data.timings, p)))}</span>
                </li>
              ))}
          </ul>
          <div className="flex items-center justify-between gap-2 bg-cream-50 px-5 py-3 text-xs text-night-600/70">
            <span className="flex min-w-0 items-center gap-1 truncate">
              <Icon name="location" className="h-3.5 w-3.5 shrink-0" /> {locationLabel}
            </span>
            <Link href="/prayer-times" className="shrink-0 font-semibold text-night-700 underline decoration-gold-400 underline-offset-4">
              {dict.common.change}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

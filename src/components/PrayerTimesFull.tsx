"use client";

import { CALCULATION_METHODS } from "@/data/names";
import { Icon } from "@/components/Icon";
import { PrayerLabel } from "@/components/PrayerLabel";
import { num, time12, type Locale, type LocaleDict } from "@/i18n";
import { arabicName, clean, PRAYERS, prayerName, safeTiming, type ApiResult, type NextPrayer } from "@/lib/prayer";

export function PrayerTimesFull({
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
  cityInput,
  countryInput,
  onCityInput,
  onCountryInput,
  onSubmitCity,
  method,
  onMethodChange,
  canSave,
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
  cityInput: string;
  countryInput: string;
  onCityInput: (value: string) => void;
  onCountryInput: (value: string) => void;
  onSubmitCity: (e: React.FormEvent) => void;
  method: number;
  onMethodChange: (method: number) => void;
  canSave: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {next && data ? (
          <div className="card-dark pattern-stars relative overflow-hidden p-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold-300/80">{dict.prayer.next}</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-serif text-5xl font-semibold text-cream-50">{prayerName(dict.prayer.names, next.name)}</p>
                <p className="arabic text-2xl leading-tight text-gold-200">{next.name}</p>
              </div>
              <div className="text-end">
                <p className="text-4xl font-semibold tabular-nums text-cream-50">{time12(locale, clean(safeTiming(data.timings, next.name)))}</p>
                <p className="text-sm tabular-nums text-cream-100/70">
                  {dict.prayer.in} {next.countdown}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-cream-100/60">
              <span className="flex items-center gap-1">
                <Icon name="location" className="h-3.5 w-3.5" /> {locationLabel}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="crescent" className="h-3.5 w-3.5" />{" "}
                {num(locale, Number(data.date.hijri.day))} {data.date.hijri.month.en} {num(locale, Number(data.date.hijri.year))}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="clock" className="h-3.5 w-3.5" /> {data.meta.timezone}
              </span>
            </div>
          </div>
        ) : (
          <div className="card-dark p-7">
            <p className="font-serif text-2xl text-cream-50">
              {hasLocation ? (loading ? dict.prayer.loadingTimes : dict.prayer.title) : dict.prayer.setLocation}
            </p>
            <p className="mt-2 text-sm text-cream-100/70">{error ?? dict.prayer.locationPrompt}</p>
          </div>
        )}

        {data && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PRAYERS.map((p) => {
              const isCurrent = next?.current === p;
              const isNext = next?.name === p;
              return (
                <li
                  key={p}
                  className={`card flex items-center justify-between gap-3 p-4 ${
                    isNext ? "border-gold-400 shadow-glow" : isCurrent ? "bg-cream-100" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-night-900">
                      {prayerName(dict.prayer.names, p)}
                      {isNext && (
                        <span className="ms-2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase text-night-950">
                          {dict.prayer.nextBadge}
                        </span>
                      )}
                      {isCurrent && !isNext && (
                        <span className="ms-2 rounded-full bg-night-800 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-200">
                          {dict.prayer.now}
                        </span>
                      )}
                    </p>
                    {locale !== "ar" && (
                      <p className="arabic text-base leading-tight text-night-600/80">{arabicName(p)}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-xl font-semibold tabular-nums text-night-900">{time12(locale, clean(safeTiming(data.timings, p)))}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="card h-fit p-6 lg:col-span-2">
        <h3 className="font-semibold text-night-900">{dict.prayer.locationTitle}</h3>
        <p className="mt-1 text-xs text-night-600/70">{canSave ? dict.prayer.savedAccount : dict.prayer.savedDevice}</p>

        <button onClick={onUseLocation} disabled={locating} className="btn btn-primary mt-4 w-full">
          <Icon name="location" className="h-4 w-4" /> {locating ? dict.prayer.locating : dict.prayer.useCurrent}
        </button>

        <div className="ornament my-5 flex text-[10px] uppercase tracking-[0.3em]">{dict.common.or}</div>

        <form onSubmit={onSubmitCity} className="space-y-3">
          <div>
            <label className="label" htmlFor="city">
              {dict.prayer.city}
            </label>
            <input
              id="city"
              className="input"
              value={cityInput}
              onChange={(e) => { onCityInput(e.target.value); }}
              placeholder={dict.prayer.cityPlaceholder}
            />
          </div>
          <div>
            <label className="label" htmlFor="country">
              {dict.prayer.country}
            </label>
            <input
              id="country"
              className="input"
              value={countryInput}
              onChange={(e) => { onCountryInput(e.target.value); }}
              placeholder={dict.prayer.countryPlaceholder}
            />
          </div>
          <button type="submit" className="btn btn-outline w-full">
            {dict.prayer.find}
          </button>
        </form>

        <div className="mt-5">
          <label className="label" htmlFor="method">
            {dict.prayer.method}
          </label>
          <select id="method" className="input" value={method} onChange={(e) => { onMethodChange(Number(e.target.value)); }}>
            {CALCULATION_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {locale === "ar" ? m.nameArabic : m.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <p className="mt-5 text-[11px] leading-relaxed text-night-600/60">{dict.prayer.credit}</p>
      </div>
    </div>
  );
}

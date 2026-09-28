"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/actions/azkar";
import { CALCULATION_METHODS } from "@/data/names";
import type { UserSettings } from "@/db/schema";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { getDict, num, type Locale } from "@/i18n";

export function SettingsForm({ settings, locale }: { settings: UserSettings; locale: Locale }) {
  const dict = getDict(locale);
  const [form, setForm] = useState({
    showTransliteration: settings.showTransliteration,
    showTranslation: settings.showTranslation,
    arabicFontSize: settings.arabicFontSize,
    calculationMethod: settings.calculationMethod,
    city: settings.city ?? "",
    country: settings.country ?? "",
    timezone: settings.timezone,
  });
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const detectTimezone = () => {
    try {
      setForm((f) => ({ ...f, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" }));
    } catch {
      // ignore
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await updateSettings({
        showTransliteration: form.showTransliteration,
        showTranslation: form.showTranslation,
        arabicFontSize: form.arabicFontSize,
        calculationMethod: form.calculationMethod,
        city: form.city || null,
        country: form.country || null,
        timezone: form.timezone,
        ...(form.city && form.city !== (settings.city ?? "") ? { latitude: null, longitude: null } : {}),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => { setSaved(false); }, 2000);
      }
    });
  };

  return (
    <form onSubmit={submit} className="mt-5 space-y-5">
      <fieldset className="space-y-3">
        <legend className="label">{dict.profile.language}</legend>
        <LanguageSwitcher />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="label">{dict.profile.reading}</legend>
        <label className="flex items-center justify-between rounded-xl border border-cream-200 px-4 py-3 text-sm">
          <span>{dict.profile.showTranslit}</span>
          <input
            type="checkbox"
            checked={form.showTransliteration}
            onChange={(e) => { setForm((f) => ({ ...f, showTransliteration: e.target.checked })); }}
            className="h-4 w-4 accent-[#c9a227]"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-cream-200 px-4 py-3 text-sm">
          <span>{dict.profile.showTranslation}</span>
          <input
            type="checkbox"
            checked={form.showTranslation}
            onChange={(e) => { setForm((f) => ({ ...f, showTranslation: e.target.checked })); }}
            className="h-4 w-4 accent-[#c9a227]"
          />
        </label>
        <div className="rounded-xl border border-cream-200 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span>{dict.profile.arabicSize}</span>
            <span className="shrink-0 text-xs text-night-600/70">{dict.profile.sizes[form.arabicFontSize as 1 | 2 | 3 | 4]}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={form.arabicFontSize}
            onChange={(e) => { setForm((f) => ({ ...f, arabicFontSize: Number(e.target.value) })); }}
            className="mt-2 w-full accent-[#c9a227]"
          />
          <p className={`arabic arabic-size-${form.arabicFontSize} mt-2 text-right text-night-900`}>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</p>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="label">{dict.profile.prayerTimes}</legend>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="input"
            placeholder={dict.prayer.city}
            value={form.city}
            onChange={(e) => { setForm((f) => ({ ...f, city: e.target.value })); }}
          />
          <input
            className="input"
            placeholder={dict.prayer.country}
            value={form.country}
            onChange={(e) => { setForm((f) => ({ ...f, country: e.target.value })); }}
          />
        </div>
        <select
          className="input"
          value={form.calculationMethod}
          onChange={(e) => { setForm((f) => ({ ...f, calculationMethod: Number(e.target.value) })); }}
        >
          {CALCULATION_METHODS.map((m) => (
            <option key={m.id} value={m.id}>
              {locale === "ar" ? m.nameArabic : m.name}
            </option>
          ))}
        </select>
        {settings.latitude != null && (
          <p className="text-xs text-night-600/70">
            {dict.profile.savedCoords
              .replace("{lat}", num(locale, settings.latitude))
              .replace("{lng}", num(locale, settings.longitude ?? 0))}
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="label">{dict.profile.timezone}</legend>
        <div className="flex gap-2">
          <input className="input" value={form.timezone} onChange={(e) => { setForm((f) => ({ ...f, timezone: e.target.value })); }} />
          <button type="button" onClick={detectTimezone} className="btn btn-outline shrink-0">
            {dict.common.detect}
          </button>
        </div>
        <p className="text-xs text-night-600/70">{dict.profile.timezoneHint}</p>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? dict.common.saving : dict.profile.savePreferences}
        </button>
        {saved && <span className="text-sm font-semibold text-night-700">{dict.common.saved}</span>}
      </div>
    </form>
  );
}

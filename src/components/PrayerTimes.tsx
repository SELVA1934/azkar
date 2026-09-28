"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { updateSettings } from "@/app/actions/azkar";
import { PrayerTimesCompact } from "@/components/PrayerTimesCompact";
import { PrayerTimesFull } from "@/components/PrayerTimesFull";
import { getDict, type Locale } from "@/i18n";
import { computeNextPrayer, todayDDMMYYYY, type ApiResult } from "@/lib/prayer";

export type PrayerLocation = {
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  method: number;
  timezone?: string | null;
};

const LS_KEY = "noor:location";

export function PrayerTimes({
  initial,
  locale,
  compact = false,
  canSave = false,
}: {
  initial: PrayerLocation;
  locale: Locale;
  compact?: boolean;
  canSave?: boolean;
}) {
  const dict = useMemo(() => getDict(locale), [locale]);
  const [loc, setLoc] = useState<PrayerLocation>(initial);
  const [data, setData] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [cityInput, setCityInput] = useState(initial.city ?? "");
  const [countryInput, setCountryInput] = useState(initial.country ?? "");
  const [locating, setLocating] = useState(false);
  const hydrated = useRef(false);

  // Restore from localStorage for guests / accounts without a saved location.
  // Intentional one-time hydration (not a cascading render): the server render
  // uses `initial`, so reading localStorage must happen in an effect to avoid
  // a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect -- one-time client hydration from localStorage */
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const hasCoords = initial.latitude != null && initial.longitude != null;
    if (!hasCoords && !initial.city) {
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as PrayerLocation;
          setLoc({ ...initial, ...parsed });
          setCityInput(parsed.city ?? "");
          setCountryInput(parsed.country ?? "");
        }
      } catch {
        // ignore
      }
    }
  }, [initial]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const hasLocation = (loc.latitude != null && loc.longitude != null) || !!loc.city;

  const fetchTimes = useCallback(
    async (l: PrayerLocation) => {
      setLoading(true);
      setError(null);
      const date = todayDDMMYYYY();
      const params = new URLSearchParams({ method: String(l.method), date });
      if (l.latitude != null && l.longitude != null) {
        params.set("lat", String(l.latitude));
        params.set("lng", String(l.longitude));
      } else if (l.city) {
        params.set("city", l.city);
        if (l.country) params.set("country", l.country);
      } else {
        setLoading(false);
        return;
      }

      try {
        let json: { code?: number; data?: ApiResult } | null = null;
        try {
          const res = await fetch(`/api/prayer-times?${params.toString()}`, { cache: "no-store" });
          if (res.ok) json = await res.json();
        } catch {
          json = null;
        }
        if (!json?.data) {
          const path =
            l.latitude != null && l.longitude != null
              ? `timings/${date}?latitude=${l.latitude}&longitude=${l.longitude}&method=${l.method}`
              : `timingsByCity/${date}?city=${encodeURIComponent(l.city ?? "")}&country=${encodeURIComponent(l.country ?? "")}&method=${l.method}`;
          const res = await fetch(`https://api.aladhan.com/v1/${path}`);
          json = await res.json();
        }
        if (!json?.data?.timings) throw new Error("No timings returned");
        setData(json.data);
      } catch {
        setError(dict.prayer.loadError);
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [dict.prayer.loadError],
  );

  // Refetch when the location changes. This is external synchronization
  // (network request), which is exactly what effects are for.
  /* eslint-disable react-hooks/set-state-in-effect -- fetch on location change, not a render cascade */
  useEffect(() => {
    if (hasLocation) {
      void fetchTimes(loc);
    }
  }, [loc, hasLocation, fetchTimes]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const id = setInterval(() => { setTick((t) => t + 1); }, 1000);
    return () => { clearInterval(id); };
  }, []);

  const persist = useCallback(
    async (next: PrayerLocation) => {
      setLoc(next);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      if (canSave) {
        await updateSettings({
          city: next.city ?? null,
          country: next.country ?? null,
          latitude: next.latitude ?? null,
          longitude: next.longitude ?? null,
          calculationMethod: next.method,
        });
      }
    },
    [canSave],
  );

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setError(dict.prayer.unsupported);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        void persist({
          ...loc,
          latitude: Number(pos.coords.latitude.toFixed(5)),
          longitude: Number(pos.coords.longitude.toFixed(5)),
          city: null,
          country: null,
        });
        setCityInput("");
        setCountryInput("");
      },
      () => {
        setLocating(false);
        setError(dict.prayer.denied);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  const submitCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    void persist({ ...loc, city: cityInput.trim(), country: countryInput.trim() || null, latitude: null, longitude: null });
  };

  const next = useMemo(() => {
    void tick;
    return computeNextPrayer(data, locale);
  }, [data, tick, locale]);

  const locationLabel =
    loc.city
      ? `${loc.city}${loc.country ? `, ${loc.country}` : ""}`
      : loc.latitude != null
        ? `${loc.latitude.toFixed(2)}°, ${loc.longitude?.toFixed(2)}°`
        : dict.prayer.noLocation;

  function handleCityInput(value: string) {
    setCityInput(value);
  }

  function handleCountryInput(value: string) {
    setCountryInput(value);
  }

  function handleMethodChange(method: number) {
    void persist({ ...loc, method });
  }

  if (compact) {
    return (
      <PrayerTimesCompact
        dict={dict}
        locale={locale}
        data={data}
        loading={loading}
        error={error}
        next={next}
        hasLocation={hasLocation}
        locationLabel={locationLabel}
        locating={locating}
        onUseLocation={useMyLocation}
      />
    );
  }

  return (
    <PrayerTimesFull
      dict={dict}
      locale={locale}
      data={data}
      loading={loading}
      error={error}
      next={next}
      hasLocation={hasLocation}
      locationLabel={locationLabel}
      locating={locating}
      onUseLocation={useMyLocation}
      cityInput={cityInput}
      countryInput={countryInput}
      onCityInput={handleCityInput}
      onCountryInput={handleCountryInput}
      onSubmitCity={submitCity}
      method={loc.method}
      onMethodChange={handleMethodChange}
      canSave={canSave}
    />
  );
}

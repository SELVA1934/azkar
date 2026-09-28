"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { distanceToKaabaKm, qiblaBearing } from "@/lib/islamic";
import { getDict, num, type Locale } from "@/i18n";

type Coords = { lat: number; lng: number; label?: string };

const CITIES: Coords[] = [
  { lat: 51.5074, lng: -0.1278, label: "London" },
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 30.0444, lng: 31.2357, label: "Cairo" },
  { lat: 41.0082, lng: 28.9784, label: "Istanbul" },
  { lat: 24.8607, lng: 67.0011, label: "Karachi" },
  { lat: -6.2088, lng: 106.8456, label: "Jakarta" },
  { lat: 3.139, lng: 101.6869, label: "Kuala Lumpur" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai" },
];

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function QiblaCompass({ initial, locale }: { initial: Coords | null; locale: Locale }) {
  const dict = getDict(locale);
  const [coords, setCoords] = useState<Coords | null>(initial);
  const [heading, setHeading] = useState<number | null>(null);
  const [compassOn, setCompassOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  const bearing = coords ? qiblaBearing(coords.lat, coords.lng) : null;
  const distance = coords ? distanceToKaabaKm(coords.lat, coords.lng) : null;

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setError(dict.qibla.geolocationUnsupported);
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: dict.qibla.yourLocation });
      },
      () => {
        setLocating(false);
        setError(dict.qibla.geolocationDenied);
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  };

  const onOrientation = useCallback((e: DeviceOrientationEvent) => {
    const webkit = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
    let h: number | null = null;
    if (typeof webkit === "number") h = webkit;
    else if (e.absolute && e.alpha != null) h = 360 - e.alpha;
    else if (e.alpha != null) h = 360 - e.alpha;
    if (h != null && Number.isFinite(h)) setHeading((h + 360) % 360);
  }, []);

  const enableCompass = async () => {
    try {
      const DOE = DeviceOrientationEvent as DeviceOrientationEventWithPermission;
      if (typeof DOE.requestPermission === "function") {
        const result = await DOE.requestPermission();
        if (result !== "granted") {
          setError(dict.qibla.permissionDenied);
          return;
        }
      }
      window.addEventListener("deviceorientationabsolute" as "deviceorientation", onOrientation, true);
      window.addEventListener("deviceorientation", onOrientation, true);
      setCompassOn(true);
    } catch {
      setError(dict.qibla.unavailable);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientationabsolute" as "deviceorientation", onOrientation, true);
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [onOrientation]);

  const applyManual = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = Number(manualLat);
    const lng = Number(manualLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      setError(dict.qibla.invalidCoords);
      return;
    }
    setError(null);
    setCoords({ lat, lng, label: dict.qibla.customCoords });
  };

  // Rotation of the dial: when compass is on, rotate the dial so that north points to true north
  const dialRotation = compassOn && heading != null ? -heading : 0;
  const needleRotation = bearing != null ? bearing + dialRotation : 0;
  const relative = bearing != null && heading != null ? ((bearing - heading + 540) % 360) - 180 : null;
  const aligned = relative != null && Math.abs(relative) < 5;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <div className="card-dark pattern-stars relative flex flex-col items-center overflow-hidden p-6 sm:p-8">
          {bearing == null ? (
            <div className="py-12 text-center">
              <Icon name="compass" className="mx-auto h-12 w-12 text-gold-300" />
              <p className="mt-4 font-serif text-2xl text-cream-50">{dict.qibla.findTitle}</p>
              <p className="mt-1 text-sm text-cream-100/70">{dict.qibla.findBody}</p>
              <button onClick={locate} disabled={locating} className="btn btn-gold mt-6">
                <Icon name="location" className="h-4 w-4" /> {locating ? dict.prayer.locating : dict.prayer.useLocation}
              </button>
            </div>
          ) : (
            <>
              <div className="relative h-72 w-72 sm:h-80 sm:w-80">
                {/* Dial */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-gold-400/40 bg-gradient-to-b from-night-700/80 to-night-950 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${dialRotation}deg)` }}
                >
                  {["N", "E", "S", "W"].map((d, i) => (
                    <span
                      key={d}
                      className={`absolute left-1/2 top-1/2 text-sm font-bold ${d === "N" ? "text-red-400" : "text-cream-100/70"}`}
                      style={{ transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-125px) rotate(${-i * 90}deg)` }}
                    >
                      {d}
                    </span>
                  ))}
                  {Array.from({ length: 36 }).map((_, i) => (
                    <span
                      key={i}
                      className={`absolute left-1/2 top-1/2 w-px ${i % 9 === 0 ? "h-4 bg-gold-300" : "h-2 bg-cream-100/30"}`}
                      style={{ transform: `translate(-50%, -50%) rotate(${i * 10}deg) translateY(-146px)` }}
                    />
                  ))}
                </div>

                {/* Needle */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                >
                  <div className="absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${aligned ? "bg-gold-400 text-night-950" : "bg-gold-500/20 text-gold-300"} border border-gold-400/60`}>
                      <Icon name="kaaba" className="h-5 w-5" />
                    </span>
                    <span className="mt-1 h-24 w-1 rounded-full bg-gradient-to-b from-gold-400 to-transparent" />
                  </div>
                </div>

                {/* Center */}
                <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-400/50 bg-night-900 text-center">
                  <span className="text-sm font-semibold tabular-nums text-cream-50">{num(locale, Math.round(bearing))}°</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="font-serif text-3xl font-semibold text-cream-50">
                  {num(locale, Math.round(bearing))}° <span className="text-lg text-gold-300">{dict.qibla.fromNorth}</span>
                </p>
                <p className="mt-1 text-sm text-cream-100/70">
                  {coords?.label ?? dict.qibla.location} · {num(locale, Math.round(distance ?? 0))} {dict.qibla.toMakkah}
                </p>
                {compassOn ? (
                  <p className={`mt-3 text-sm font-semibold ${aligned ? "text-gold-300" : "text-cream-100/70"}`}>
                    {heading == null
                      ? dict.qibla.waiting
                      : aligned
                        ? dict.qibla.facing
                        : ((relative ?? 0) > 0 ? dict.qibla.turnRight : dict.qibla.turnLeft).replace(
                            "{n}",
                            num(locale, Math.abs(Math.round(relative ?? 0))),
                          )}
                  </p>
                ) : (
                  <button onClick={() => { void enableCompass(); }} className="btn btn-gold mt-4 !py-2">
                    <Icon name="compass" className="h-4 w-4" /> {dict.qibla.enable}
                  </button>
                )}
              </div>
            </>
          )}
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </div>
        <p className="mt-3 text-xs text-night-600/60">{dict.qibla.dialNote}</p>
      </section>

      <aside className="space-y-6 lg:col-span-2">
        <div className="card p-5">
          <h3 className="font-semibold text-night-900">{dict.qibla.location}</h3>
          <button onClick={locate} disabled={locating} className="btn btn-primary mt-3 w-full">
            <Icon name="location" className="h-4 w-4" /> {locating ? dict.prayer.locating : dict.prayer.useLocation}
          </button>
          <div className="ornament my-4 flex text-[10px] uppercase tracking-[0.3em]">{dict.qibla.pickCity}</div>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((c) => (
              <button
                key={c.label}
                onClick={() => { setCoords(c); }}
                className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                  coords?.label === c.label ? "border-gold-400 bg-gold-100/50 font-semibold" : "border-cream-200 hover:border-gold-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <form onSubmit={applyManual} className="mt-4 space-y-2">
            <label className="label">{dict.qibla.coordinates}</label>
            <div className="flex gap-2">
              <input className="input" placeholder={dict.qibla.latitude} value={manualLat} onChange={(e) => { setManualLat(e.target.value); }} inputMode="decimal" />
              <input className="input" placeholder={dict.qibla.longitude} value={manualLng} onChange={(e) => { setManualLng(e.target.value); }} inputMode="decimal" />
            </div>
            <button type="submit" className="btn btn-outline w-full">
              {dict.qibla.setCoordinates}
            </button>
          </form>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-night-900">{dict.qibla.about}</h3>
          <p className="arabic mt-2 text-xl leading-loose text-night-800">فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ</p>
          <p className="mt-1 text-sm text-night-700">&ldquo;So turn your face toward al-Masjid al-Haram.&rdquo; — Al-Baqarah 2:144</p>
          <p className="mt-3 text-xs leading-relaxed text-night-600/70">{dict.qibla.aboutBody}</p>
        </div>
      </aside>
    </div>
  );
}

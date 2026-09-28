import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{2}-\d{2}-\d{4}$/;

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const lat = sp.get("lat");
    const lng = sp.get("lng");
    const city = sp.get("city");
    const country = sp.get("country") ?? "";
    const method = Number(sp.get("method") ?? 3);
    const dateParam = sp.get("date") ?? "";

    const d = new Date();
    const fallbackDate = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
    const date = DATE_RE.test(dateParam) ? dateParam : fallbackDate;
    const safeMethod = Number.isFinite(method) && method >= 0 && method <= 23 ? method : 3;

    let url: string;
    if (lat && lng && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
      const safeLat = Math.max(-90, Math.min(90, Number(lat)));
      const safeLng = Math.max(-180, Math.min(180, Number(lng)));
      url = `https://api.aladhan.com/v1/timings/${date}?latitude=${safeLat}&longitude=${safeLng}&method=${safeMethod}`;
    } else if (city && city.length <= 100) {
      url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country.slice(0, 100))}&method=${safeMethod}`;
    } else {
      return Response.json({ error: "Provide lat/lng or city" }, { status: 400 });
    }

    try {
      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (!res.ok) {
        return Response.json({ error: "Upstream error" }, { status: 502 });
      }
      const json = await res.json().catch(() => null);
      if (!json) {
        return Response.json({ error: "Invalid upstream response" }, { status: 502 });
      }
      return Response.json(json, {
        headers: { "Cache-Control": "public, max-age=900" },
      });
    } catch (error) {
      console.error("[prayer-times] upstream request failed", error);
      return Response.json({ error: "Failed to reach prayer time service" }, { status: 502 });
    }
  } catch (error) {
    console.error("[prayer-times] invalid request", error);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

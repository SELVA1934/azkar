import type { Metadata } from "next";
import { NamesGrid } from "@/components/NamesGrid";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.names.title };
}

export default async function NamesPage() {
  const { locale, dict } = await getI18n();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{dict.names.kicker}</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-night-900">{dict.names.title}</h1>
        <p className="arabic mt-1 text-2xl text-night-600">أسماء الله الحسنى</p>
        <p className="mt-2 max-w-2xl text-night-600/80">{dict.names.quote}</p>
      </header>
      <NamesGrid locale={locale} />
    </main>
  );
}

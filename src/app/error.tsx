"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";

/** Route-level boundary: keeps a rendering error from blanking the page. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { dict } = useI18n();

  useEffect(() => {
    console.error("[noor]", error);
  }, [error]);

  return (
    <main className="pattern-stars-light grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <div className="card max-w-md p-10 text-center">
        <Icon name="info" className="mx-auto h-10 w-10 text-gold-500" />
        <p className="arabic mt-4 text-2xl text-night-700">لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-night-900">{dict.error.title}</h1>
        <p className="mt-2 text-sm text-night-600/80">{dict.error.body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={reset} className="btn btn-primary">
            {dict.error.retry}
          </button>
          <Link href="/" className="btn btn-outline">
            {dict.notFound.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}

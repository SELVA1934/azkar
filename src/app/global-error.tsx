"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors raised above the root layout (where the
 * i18n provider may not be mounted), so we ship static bilingual copy here.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[noor:global]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#fdfbf6",
          color: "#0a1f1a",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <p style={{ fontSize: "1.5rem", margin: 0 }}>إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
          <h1 style={{ fontSize: "1.75rem", margin: "0.75rem 0 0" }}>Something went wrong</h1>
          <p style={{ color: "#4b6b60", margin: "0.5rem 0 0" }}>
            حدث خطأ ما · Please reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.7rem 1.5rem",
              borderRadius: 999,
              border: "none",
              background: "#0f2d25",
              color: "#fdfbf6",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

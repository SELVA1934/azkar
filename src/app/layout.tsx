import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { I18nProvider } from "@/i18n/provider";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return {
    title: { default: `Noor · ${dict.nav.brand}`, template: "%s · Noor" },
    description: dict.home.heroBody,
  };
}

export const viewport = { themeColor: "#0f2d25", width: "device-width", initialScale: 1 } as const;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [user, { locale, dir }] = await Promise.all([getCurrentUser(), getI18n()]);

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <I18nProvider locale={locale}>
          <Navbar user={user} />
          <div className="pb-24 md:pb-10">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}

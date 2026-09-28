"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SafeUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Icon } from "@/components/Icon";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { useI18n } from "@/i18n/provider";
import type { IconName } from "@/components/Icon";

const NAV: { href: string; key: "home" | "azkar" | "tasbih" | "prayers" | "qibla" | "names"; icon: IconName }[] = [
  { href: "/", key: "home", icon: "home" },
  { href: "/azkar", key: "azkar", icon: "book" },
  { href: "/tasbih", key: "tasbih", icon: "beads" },
  { href: "/prayer-times", key: "prayers", icon: "mosque" },
  { href: "/qibla", key: "qibla", icon: "compass" },
  { href: "/names", key: "names", icon: "star" },
];

export function Navbar({ user }: { user: SafeUser | null }) {
  const pathname = usePathname();
  const { dict } = useI18n();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold-500/20 bg-night-900/95 text-cream-100 backdrop-blur supports-[backdrop-filter]:bg-night-900/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-400/50 bg-night-800 shadow-glow transition group-hover:scale-105">
              <Icon name="crescent" className="h-5 w-5 text-gold-300" />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-2xl font-semibold tracking-wide text-gold-gradient">Noor</span>
              <span className="-mt-1 hidden whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-cream-200/60 sm:block">
                {dict.nav.brand}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive(item.href) ? "bg-gold-500/15 text-gold-200" : "text-cream-100/75 hover:bg-white/5 hover:text-cream-50"
                }`}
              >
                {dict.nav[item.key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher compact />

            {user ? (
              <>
                <Link
                  href="/favorites"
                  className={`hidden rounded-full p-2 transition hover:bg-white/5 sm:block ${
                    isActive("/favorites") ? "text-gold-300" : "text-cream-100/75"
                  }`}
                  aria-label={dict.nav.favorites}
                  title={dict.nav.favorites}
                >
                  <Icon name="heart" className="h-5 w-5" />
                </Link>
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 rounded-full border px-1.5 py-1.5 pe-3 text-sm transition ${
                    isActive("/profile")
                      ? "border-gold-400/60 bg-gold-500/10 text-gold-100"
                      : "border-white/10 text-cream-100/85 hover:border-gold-400/40"
                  }`}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-xs font-bold text-night-950">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate sm:block">{user.name.split(" ")[0]}</span>
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="hidden rounded-full p-2 text-cream-100/60 transition hover:bg-white/5 hover:text-cream-50 sm:block"
                    aria-label={dict.nav.signOut}
                    title={dict.nav.signOut}
                  >
                    <Icon name="logout" className="h-5 w-5" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost hidden !text-cream-100/85 hover:!bg-white/5 hover:!text-white sm:inline-flex">
                  {dict.nav.signIn}
                </Link>
                <Link href="/register" className="btn btn-gold !px-4 !py-2">
                  {dict.nav.getStarted}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/20 bg-night-900/95 text-cream-100 backdrop-blur lg:hidden">
        <ul className="grid grid-cols-6">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                  isActive(item.href) ? "text-gold-300" : "text-cream-100/60"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                {dict.nav[item.key]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

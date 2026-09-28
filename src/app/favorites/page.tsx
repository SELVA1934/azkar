import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteCard } from "@/components/FavoriteCard";
import { Icon } from "@/components/Icon";
import { getCurrentUser, getSettings } from "@/lib/auth";
import { getI18n } from "@/i18n/server";
import { getFavoriteAzkar } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.favorites.title };
}
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const { locale, dict } = await getI18n();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [favorites, settings] = await Promise.all([getFavoriteAzkar(user.id), getSettings(user.id)]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{dict.favorites.kicker}</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-night-900">{dict.favorites.title}</h1>
        <p className="arabic mt-1 text-2xl text-night-600">المفضلة</p>
        <p className="mt-2 text-night-600/80">{dict.favorites.intro}</p>
      </header>

      {favorites.length === 0 ? (
        <div className="card p-10 text-center">
          <Icon name="heart" className="mx-auto h-10 w-10 text-gold-500" />
          <p className="mt-4 font-serif text-2xl text-night-900">{dict.favorites.empty}</p>
          <p className="mt-1 text-sm text-night-600/75">{dict.favorites.emptyBody}</p>
          <Link href="/azkar" className="btn btn-primary mt-6">
            {dict.common.browse}
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {favorites.map((f) => (
            <FavoriteCard key={f.id} locale={locale} item={f} fontSize={settings.arabicFontSize} />
          ))}
        </ul>
      )}
    </main>
  );
}

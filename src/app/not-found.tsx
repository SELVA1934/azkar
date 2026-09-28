import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { dict } = await getI18n();
  return (
    <main className="pattern-stars-light grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <div className="card max-w-md p-10 text-center">
        <Icon name="crescent" className="mx-auto h-10 w-10 text-gold-500" />
        <p className="arabic mt-4 text-2xl text-night-700">إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-night-900">{dict.notFound.title}</h1>
        <p className="mt-2 text-sm text-night-600/80">{dict.notFound.body}</p>
        <Link href="/" className="btn btn-primary mt-6">
          {dict.notFound.backHome}
        </Link>
      </div>
    </main>
  );
}

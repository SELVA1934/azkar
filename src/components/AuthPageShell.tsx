import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { getI18n } from "@/i18n/server";

/** Shared login/register shell: bounces signed-in users home, centers the form. */
export async function AuthPageShell({ mode }: { mode: "login" | "register" }) {
  const { locale } = await getI18n();
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <main className="pattern-stars-light grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <AuthForm mode={mode} locale={locale} />
    </main>
  );
}

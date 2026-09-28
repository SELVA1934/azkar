import type { Metadata } from "next";
import { AuthPageShell } from "@/components/AuthPageShell";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.auth.signIn };
}
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <AuthPageShell mode="login" />;
}

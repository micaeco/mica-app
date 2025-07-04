import { headers } from "next/headers";

import { auth } from "@adapters/auth";
import { LanguageSwitcher } from "@app/_components/language-switcher";
import { redirect } from "@app/_i18n/routing";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: "/", locale: locale });
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      {children}
      <LanguageSwitcher className="w-fit" />
    </div>
  );
}

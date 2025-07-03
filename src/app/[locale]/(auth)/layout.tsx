import { headers } from "next/headers";

import { auth } from "@adapters/auth";
import { redirect } from "@app/_i18n/routing";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: "/", locale: locale });
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">{children}</div>
  );
}

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@adapters/auth";
import { BaseLayout } from "@app/_components/base-layout";
import { Locale, redirect, routing } from "@app/_i18n/routing";
import { User } from "@domain/entities/user";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const user = session.user as User;
    const userLocale = user.locale;

    if (userLocale && userLocale !== locale && routing.locales.includes(userLocale as Locale)) {
      redirect({ href: "/", locale: userLocale as Locale });
    }
  }

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}

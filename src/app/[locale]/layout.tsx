import { notFound } from "next/navigation";

import { BaseLayout } from "@presentation/components/base-layout";
import { Locale, routing } from "@presentation/i18n/routing";
import { env } from "env";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MICA App",
  description: "Aplicació de MICA",
  metadataBase: new URL(env.NEXT_PUBLIC_URL),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await Promise.resolve(params);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}

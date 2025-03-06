import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BaseLayout } from "@components/base-layout";
import { Locale, routing } from "@i18n/routing";

export const metadata: Metadata = {
  title: "MICA App",
  description: "Aplicació de MICA",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}

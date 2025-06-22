import { notFound } from "next/navigation";

import { BaseLayout } from "@app/_components/base-layout";
import { Locale, routing } from "@app/_i18n/routing";

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

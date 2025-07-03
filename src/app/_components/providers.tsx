"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { TrpcProvider } from "@app/_components/trpc-provider";

export function ClientProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={userTimeZone}>
      <TrpcProvider>{children}</TrpcProvider>
    </NextIntlClientProvider>
  );
}

"use client";

import { Auth0Provider as UserProvider } from "@auth0/nextjs-auth0";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { TrpcProvider } from "@app/_components/trpc-provider";

export function ClientProviders({
  children,
  session,
  locale,
  messages,
}: {
  children: React.ReactNode;
  session: SessionData | null;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <UserProvider user={session?.user}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={userTimeZone}>
        <TrpcProvider>{children}</TrpcProvider>
      </NextIntlClientProvider>
    </UserProvider>
  );
}

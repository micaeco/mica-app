import { Montserrat } from "next/font/google";

import { getMessages } from "next-intl/server";

import { ClientProviders } from "@app/_components/providers";
import { Toaster } from "@app/_components/ui/sonner";

const montserrat = Montserrat({ subsets: ["latin"] });

export async function BaseLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <meta name="apple-mobile-web-app-title" content="MICA" />
        <meta name="apple-mobile-web-app-title" content="MICA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="apple-touch-icon" sizes="180x180" href="/icons/logo-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/logo-167.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/logo-120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/logo-152.png" />

        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={montserrat.className}>
        <ClientProviders locale={locale} messages={messages}>
          {children}
        </ClientProviders>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}

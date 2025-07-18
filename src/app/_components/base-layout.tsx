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

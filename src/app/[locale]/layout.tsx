import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import EventsProvider from "@/components/layout/events-provider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MICA App",
  description: "Aplicació de MICA",
  icons: {
    icon: "/logos/logo.webp",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={montserrat.className}>
        <NextIntlClientProvider messages={messages}>
          <Sidebar />
          <main className="flex-1 p-4 lg:ml-64 mt-16 lg:mt-0">
            <EventsProvider>{children}</EventsProvider>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

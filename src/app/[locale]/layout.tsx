import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Locale, routing } from "@/i18n/routing";

import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import EventsProvider from "@/components/events-provider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MICA App",
  description: "Aplicació de MICA",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={montserrat.className}>
        <NextIntlClientProvider messages={messages}>
          <SidebarProvider>
            <Sidebar />
            <main className="w-full overflow-hidden">
              <Header />
              <EventsProvider>{children}</EventsProvider>
            </main>
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

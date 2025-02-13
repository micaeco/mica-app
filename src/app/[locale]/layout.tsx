import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Locale, routing } from "@/i18n/routing";

import "./globals.css";
import Sidebar from "@/app/_components/sidebar";
import Header from "@/app/_components/header";
import Navbar from "@/app/_components/navbar";
import { SidebarProvider } from "@/app/_components/ui/sidebar";
import EventsProvider from "@/app/_providers/events-provider";

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
            <Sidebar className="!h-[calc(100svh-var(--navbar-height))]" />
            <main className="w-full overflow-hidden pb-(--navbar-height)">
              <Header />
              <EventsProvider>
                <div className="pt-(--header-height)">{children}</div>
              </EventsProvider>
            </main>
            <Navbar />
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

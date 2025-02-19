import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Locale, routing } from "@/i18n/routing";

import "@/app/globals.css";
import { AppSidebar } from "@components/sidebar";
import { Header } from "@components/header";
import { Navbar } from "@components/navbar";
import { SidebarProvider } from "@components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { EventsProvider } from "@providers/events-provider";

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
            <AppSidebar className="!h-[calc(100svh-var(--navbar-height))]" />
            <main className="w-full overflow-hidden pb-(--navbar-height)">
              <Header />
              <EventsProvider>
                <div className="pt-(--header-height)">{children}</div>
              </EventsProvider>
            </main>
            <Navbar />
            <Toaster />
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

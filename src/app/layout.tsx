import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className={montserrat.className}>
        <Sidebar />
        <main className="flex-1 p-4 lg:ml-64 mt-16 lg:mt-0">
          <EventsProvider>{children}</EventsProvider>
        </main>
      </body>
    </html>
  );
}

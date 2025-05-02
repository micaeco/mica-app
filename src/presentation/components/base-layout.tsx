import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Montserrat } from "next/font/google";

import { AppSidebar } from "@presentation/components/sidebar";
import { Header } from "@presentation/components/header";
import { Navbar } from "@presentation/components/navbar";
import { Toaster } from "@presentation/components/ui/sonner";
import { SidebarProvider } from "@presentation/components/ui/sidebar";

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
      <body className={montserrat.className}>
        <NextIntlClientProvider messages={messages}>
          <SidebarProvider>
            <AppSidebar className="!h-[calc(100svh-var(--navbar-height))]" />
            <main className="w-full overflow-hidden pb-(--navbar-height)">
              <Header />
              <div className="pt-(--header-height)">{children}</div>
            </main>
            <Navbar />
            <Toaster richColors />
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

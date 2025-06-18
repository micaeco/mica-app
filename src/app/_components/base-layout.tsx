import { Montserrat } from "next/font/google";

import { getMessages } from "next-intl/server";

import { auth } from "@adapters/auth";
import { Header } from "@app/_components/header";
import { HouseholdGate } from "@app/_components/household-gate";
import { HouseholdsInitializer } from "@app/_components/households-initializer";
import { Navbar } from "@app/_components/navbar";
import { ClientProviders } from "@app/_components/providers";
import { AppSidebar } from "@app/_components/sidebar";
import { SidebarProvider } from "@app/_components/ui/sidebar";
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
  const session = await auth.getSession();

  return (
    <html lang={locale}>
      <body className={montserrat.className}>
        <ClientProviders session={session} locale={locale} messages={messages}>
          <HouseholdsInitializer>
            <SidebarProvider>
              <AppSidebar className="!h-[calc(100svh-var(--navbar-height))]" />
              <main className="w-full overflow-hidden pb-(--navbar-height)">
                <Header />
                <div className="pt-(--header-height)">
                  <HouseholdGate>{children}</HouseholdGate>
                </div>
              </main>
              <Navbar />
            </SidebarProvider>
          </HouseholdsInitializer>
        </ClientProviders>
        <Toaster richColors />
      </body>
    </html>
  );
}

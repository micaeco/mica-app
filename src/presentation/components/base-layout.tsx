import { Montserrat } from "next/font/google";

import { getMessages } from "next-intl/server";

import { auth } from "@adapters/auth";
import { Header } from "@presentation/components/header";
import { Navbar } from "@presentation/components/navbar";
import { ClientProviders } from "@presentation/components/providers";
import { AppSidebar } from "@presentation/components/sidebar";
import { SidebarProvider } from "@presentation/components/ui/sidebar";
import { Toaster } from "@presentation/components/ui/sonner";

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
          <SidebarProvider>
            <AppSidebar className="!h-[calc(100svh-var(--navbar-height))]" />
            <main className="w-full overflow-hidden pb-(--navbar-height)">
              <Header />
              <div className="pt-(--header-height)">{children}</div>
            </main>
            <Navbar />
            <Toaster richColors />
          </SidebarProvider>
        </ClientProviders>
      </body>
    </html>
  );
}

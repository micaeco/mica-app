import { headers } from "next/headers";

import { auth } from "@adapters/auth";
import { Header } from "@app/_components/header";
import { HouseholdGate } from "@app/_components/household-gate";
import { HouseholdsInitializer } from "@app/_components/households-initializer";
import { Navbar } from "@app/_components/navbar";
import { AppSidebar } from "@app/_components/sidebar";
import { SidebarProvider } from "@app/_components/ui/sidebar";
import { redirect } from "@app/_i18n/routing";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({ href: "/signin", locale });
  }

  return (
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
  );
}

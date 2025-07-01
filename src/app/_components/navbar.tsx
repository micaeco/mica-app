"use client";

import { usePathname } from "next/navigation";

import { Home, PieChart, CopyCheck } from "lucide-react";

import { Link } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";

const navItems = [
  { icon: PieChart, href: "/consumption" },
  { icon: Home, href: "/" },
  { icon: CopyCheck, href: "/actions" },
];

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  const { selectedHouseholdId } = useHouseholdStore();

  const { data: leakEvents } = trpc.event.getNumberOfLeakEvents.useQuery(
    {
      householdId: selectedHouseholdId,
    },
    {
      enabled: !!selectedHouseholdId,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    }
  );

  const { data: unknownEvents } = trpc.event.getNumberOfUnknownEvents.useQuery(
    {
      householdId: selectedHouseholdId,
    },
    {
      enabled: !!selectedHouseholdId,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    }
  );

  const totalEvents = (leakEvents ?? 0) + (unknownEvents ?? 0);

  return (
    <nav
      className={cn(
        "bg-brand-primary border-border fixed right-0 bottom-0 left-0 h-(--navbar-height) border-t",
        className
      )}
    >
      <ul className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive = cleanPathname === item.href;
          const isActionsIcon = item.href === "/actions";
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex h-full w-full flex-col items-center justify-center px-3 py-2 text-sm hover:text-white focus:text-white",
                  isActive ? "text-white" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-3 transition-colors",
                    isActive && "bg-white/10"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  {isActionsIcon && totalEvents > 0 && (
                    <span
                      className={cn(
                        "absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                      )}
                    >
                      {totalEvents}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

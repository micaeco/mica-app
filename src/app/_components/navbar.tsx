"use client";

import { usePathname } from "next/navigation";

import { Home, PieChart, CopyCheck } from "lucide-react";

import { Link } from "@app/_i18n/routing";
import { cn } from "@app/_lib/utils";

const navItems = [
  { icon: PieChart, tag: "Consumption", href: "/consumption" },
  { icon: Home, tag: "Home", href: "/" },
  { icon: CopyCheck, tag: "Actions", href: "/actions" },
];

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  // Remove locale prefix (assuming it's two letters, e.g., /es, /en)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

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
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex h-full w-full flex-col items-center justify-center px-3 py-2 text-sm hover:text-white ${
                  isActive ? "text-white" : "text-muted-foreground"
                }`}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-3 transition-colors",
                    isActive && "bg-white/10"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

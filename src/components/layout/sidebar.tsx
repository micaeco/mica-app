"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  PieChart,
  Sheet,
  Droplet,
  Trophy,
  Leaf,
  User,
  Settings,
  CircleHelp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

const navPages = [
  {
    name: "Consum",
    href: "/",
    icon: PieChart,
  },
  {
    name: "Dades",
    href: "/data",
    icon: Sheet,
  },
  {
    name: "Estalvi",
    href: "/savings",
    icon: Droplet,
  },
  {
    name: "Comunitat",
    href: "/community",
    icon: Trophy,
  },
  {
    name: "Planta un arbre",
    href: "/plant-a-tree",
    icon: Leaf,
  },
];

const navSettings = [
  {
    name: "Perfil",
    href: "/profile",
    icon: User,
  },
  {
    name: "Configuració",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Ajuda",
    href: "/help",
    icon: CircleHelp,
  },
];

const allNavItems = [...navPages, ...navSettings];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeName, setActiveName] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const activeItem = allNavItems.find((item) => item.href === pathname);
    setActiveName(activeItem?.name || "");
  }, [pathname]);

  return (
    <>
      {/* Mobile menu header */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between h-16 p-4 z-10 lg:hidden bg-white shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="flex-shrink-0"
        >
          <Menu className="h-8 w-8" />
        </Button>
        <h5 className="font-bold absolute left-1/2 transform -translate-x-1/2">
          {activeName}
        </h5>
        <Avatar />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed shadow-lg inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex justify-between items-center p-4 select-none">
            <div className="flex flex-row items-center space-x-2">
              <Image
                src="/logos/logo-white.png"
                alt="MICA"
                width={35}
                height={35}
              />
              <h5 className="font-semibold">MICA</h5>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Sidebar content */}
          <nav className="flex flex-col h-full justify-between items-stretch gap-1 p-2">
            <div className="flex flex-col gap-2 py-2">
              {navPages.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/20 ${
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  <item.icon />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-1 py-6">
              {navSettings.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/20 ${
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  <item.icon />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

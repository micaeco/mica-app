import { PieChart, Droplet, User, Settings, CircleHelp, BookOpen } from "lucide-react";

import { Category, Device } from "@/lib/types";

export function getCategories(categories: Record<string, string>): Category[] {
  return [
    {
      name: "shower",
      icon: "/icons/shower.webp",
      color: "--chart-1",
      label: categories["shower"],
    },
    {
      name: "washer",
      icon: "/icons/washing-machine.webp",
      color: "--chart-2",
      label: categories["washer"],
    },
    {
      name: "toilet",
      icon: "/icons/toilet.webp",
      color: "--chart-3",
      label: categories["toilet"],
    },
    {
      name: "sink",
      icon: "/icons/sink.webp",
      color: "--chart-4",
      label: categories["sink"],
    },
    {
      name: "dishwasher",
      icon: "/icons/dishwasher.webp",
      color: "--chart-5",
      label: categories["dishwasher"],
    },
  ];
}

export function getDevices(devices: Record<string, string>, categories: Category[]): Device[] {
  return [
    {
      name: devices["shower-room-2"],
      category: categories.find((c) => c.name === "shower") as Category,
    },
    {
      name: devices["washer"],
      category: categories.find((c) => c.name === "washer") as Category,
    },
    {
      name: devices["toilet-room-2"],
      category: categories.find((c) => c.name === "toilet") as Category,
    },
    {
      name: devices["shower-room-1"],
      category: categories.find((c) => c.name === "shower") as Category,
    },
    {
      name: devices["toilet-room-1"],
      category: categories.find((c) => c.name === "toilet") as Category,
    },
    {
      name: devices["kitchen-sink"],
      category: categories.find((c) => c.name === "sink") as Category,
    },
    {
      name: devices["bathroom-sink"],
      category: categories.find((c) => c.name === "sink") as Category,
    },
    {
      name: devices["dishwasher"],
      category: categories.find((c) => c.name === "dishwasher") as Category,
    },
  ];
}

export function getNavPages(t: (key: string) => string) {
  return [
    {
      name: t("nav-pages.consumption"),
      href: "/",
      icon: PieChart,
    },
    {
      name: t("nav-pages.data"),
      href: "/data",
      icon: BookOpen,
    },
    {
      name: t("nav-pages.savings"),
      href: "/savings",
      icon: Droplet,
    },
  ];
}

export function getNavSettings(t: (key: string) => string) {
  return [
    {
      name: t("nav-settings.profile"),
      href: "/profile",
      icon: User,
    },
    {
      name: t("nav-settings.settings"),
      href: "/settings",
      icon: Settings,
    },
    {
      name: t("nav-settings.help"),
      href: "/help",
      icon: CircleHelp,
    },
  ];
}

export function getAllNavItems(t: (key: string) => string) {
  return [...getNavPages(t), ...getNavSettings(t)];
}

import { PieChart, Droplet, User, Settings, CircleHelp, BookOpen } from "lucide-react";

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

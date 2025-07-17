"use client";

import { ChevronRight, HelpCircle, LogOut, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@app/_components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@app/_components/ui/sheet";
import { Locale, useRouter } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";
import { KeysOfType } from "@app/_types/utils";

import { MenuItem, MenuList } from "./ui/menu-list";

export function EditProfileSheet({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const tCommon = useTranslations("common");

  const { data: session } = authClient.useSession();

  interface SettingsListItemData {
    icon: React.ReactNode;
    label: KeysOfType<IntlMessages["common"], string>;
    onClick?: (locale?: Locale) => void;
  }

  const menuItems: SettingsListItemData[] = [
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "help",
      onClick: (locale) => window.open(`https://mica.eco/${locale}/faqs`),
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "contact-us",
      onClick: (locale) => window.open(`https://mica.eco/${locale}/contact`),
    },
    {
      icon: <LogOut className="h-5 w-5" />,
      label: "logout",
      onClick: async () => {
        await authClient.signOut();
        router.push("/signin");
      },
    },
  ];

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="from-brand-secondary w-full space-y-12 bg-gradient-to-b from-5% to-white to-45% p-4 py-16 sm:p-6">
        <SheetHeader>
          <Avatar className="border-brand-primary mx-auto h-12 w-12 border-2 bg-white">
            <AvatarImage
              className="object-contain"
              src={session?.user?.image ? session.user.image : "/logos/logo.webp"}
              alt={session?.user?.name || "User Avatar"}
            />
            <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <SheetTitle className="text-center">{session?.user?.name || "User Profile"}</SheetTitle>
          {session?.user?.email && (
            <p className="text-center text-sm text-gray-500">{session.user.email}</p>
          )}
        </SheetHeader>

        <div className="px-2 sm:px-0">
          <MenuList>
            {menuItems.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  className="flex items-center justify-between"
                  onClick={() => item.onClick?.(locale as Locale)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-neutral-500">{item.icon}</span>
                    <span>{tCommon(item.label)}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </MenuItem>
              );
            })}
          </MenuList>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";

import { Check, ChevronRight, Globe, HelpCircle, Loader2, LogOut, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@app/_components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@app/_components/ui/sheet";
import { Locale, usePathname, useRouter } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";
import { KeysOfType } from "@app/_types/utils";

import { MenuItem, MenuList } from "./ui/menu-list";

const languages: { code: Locale; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ca", name: "Català" },
];

export function EditProfileSheet({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const tCommon = useTranslations("common");

  const { data: session } = authClient.useSession();

  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const handleLanguageChange = async (newLocale: Locale) => {
    setIsChangingLanguage(true);
    try {
      if (session?.user) {
        await authClient.updateUser({ locale: newLocale });
      }
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    } catch (error) {
      console.error("Failed to update language:", error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

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
      label: "contactUs",
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
              src={session?.user?.image || undefined}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MenuItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-neutral-500" />
                    <span>{tCommon("language")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isChangingLanguage ? (
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                    ) : (
                      <>
                        <span className="text-sm text-neutral-500">{currentLanguage?.name}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </>
                    )}
                  </div>
                </MenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{lang.name}</span>
                    {lang.code === locale && (
                      <span className="ml-auto">
                        <Check />
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

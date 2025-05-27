import { redirect } from "next/navigation";

import { useUser } from "@auth0/nextjs-auth0";
import { ChevronRight, HelpCircle, LogOut, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@presentation/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@presentation/components/ui/sheet";
import { Locale } from "@presentation/i18n/routing";
import { cn } from "@presentation/lib/utils";
import { KeysOfType } from "@presentation/types/utils";

interface SettingsListItemData {
  id: string;
  icon: React.ReactNode;
  label: KeysOfType<IntlMessages["common"], string>;
  onClick?: (locale?: Locale) => void;
}

const menuItems: SettingsListItemData[] = [
  {
    id: "help",
    icon: <HelpCircle className="h-5 w-5" />,
    label: "help",
    onClick: (locale) => window.open(`https://mica.eco/${locale}/faqs`),
  },
  {
    id: "contact",
    icon: <Users className="h-5 w-5" />,
    label: "contact-us",
    onClick: (locale) => window.open(`https://mica.eco/${locale}/contact`),
  },
  {
    id: "logout",
    icon: <LogOut className="h-5 w-5" />,
    label: "logout",
    onClick: () => redirect("/auth/logout"),
  },
];

export function EditProfilePanel({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const tCommon = useTranslations("common");

  const { user } = useUser();

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="from-brand-secondary w-full space-y-12 bg-gradient-to-b from-5% to-white to-45% p-4 py-16 sm:p-6">
        <SheetHeader>
          <Avatar className="border-brand-primary mx-auto h-12 w-12 border-2 sm:h-16 sm:w-16">
            <AvatarImage
              className="object-contain"
              src={user?.picture ? user.picture : "/logos/logo.webp"}
              alt={user?.name || "User Avatar"}
            />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <SheetTitle className="text-center">{user?.name || "User Profile"}</SheetTitle>
          {user?.email && <p className="text-center text-sm text-gray-500">{user.email}</p>}
        </SheetHeader>

        <div className="px-2 sm:px-0">
          {menuItems && menuItems.length > 0 && (
            <div className="w-full overflow-hidden rounded-lg border border-neutral-200/70 bg-white shadow-sm">
              {menuItems.map((item, index) => {
                const isLastItem = index === menuItems.length - 1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => item.onClick?.(locale as Locale)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-neutral-700 transition-colors duration-150 ease-in-out hover:bg-neutral-100/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none",
                      isLastItem && "border-b border-neutral-200/70"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-neutral-500">{item.icon}</span>
                      <span>{tCommon(item.label)}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

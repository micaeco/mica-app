"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { EditProfileSheet } from "@app/_components/edit-profile-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@app/_components/ui/avatar";
import { useSidebar } from "@app/_components/ui/sidebar";
import { usePathname } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const tNavPages = useTranslations("common.navPages");

  const { data: session } = authClient.useSession();

  const { households, selectedHouseholdId } = useHouseholdStore();

  const household = households.find((h) => h.id === selectedHouseholdId);

  return (
    <header
      className={cn(
        className,
        "fixed top-0 z-10 flex h-(--header-height) w-full items-center border-b bg-white p-4"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar}>
            <Menu />
          </button>
          <p className="text-sm font-semibold">
            {household?.name
              ? household?.name
              : /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
                tNavPages.has(pathname as any)
                ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
                  tNavPages(pathname as any)
                : pathname == "/"
                  ? tNavPages("/")
                  : tNavPages("/404")}
          </p>
        </div>

        <div className="fixed top-2 right-3">
          <EditProfileSheet>
            <Avatar className="border-brand-primary mx-auto border-2 bg-white">
              <AvatarImage
                className="object-contain"
                src={session?.user?.image ? session.user.image : "/logos/logo.webp"}
                alt={session?.user?.name || "User Avatar"}
              />
              <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </EditProfileSheet>
        </div>
      </div>
    </header>
  );
}

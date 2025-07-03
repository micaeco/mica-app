"use client";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { EditProfilePanel } from "@app/_components/edit-profile-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@app/_components/ui/avatar";
import { useSidebar } from "@app/_components/ui/sidebar";
import { usePathname } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";
import { cn } from "@app/_lib/utils";

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();

  const tNavPages = useTranslations("common.nav-pages");

  const { data: session } = authClient.useSession();

  return (
    <header
      className={cn(
        className,
        "fixed top-0 z-10 flex h-(--header-height) w-full items-center border-b bg-white"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="bg-primary flex h-8 w-14 items-center rounded-r-full p-1 lg:w-12"
          >
            <Image src="/icons/household.webp" alt="household" width={32} height={32} />
            {state == "expanded" ? (
              <ChevronLeft size={24} className="text-white" />
            ) : (
              <ChevronRight size={24} className="text-white" />
            )}
          </button>
          <p className="text-sm font-semibold">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {tNavPages.has(pathname as any)
              ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
                tNavPages(pathname as any)
              : pathname == "/"
                ? tNavPages("/")
                : tNavPages("/404")}
          </p>
        </div>

        <div className="fixed top-2 right-3">
          <EditProfilePanel>
            <Avatar className="border-brand-primary mx-auto border-2 bg-white">
              <AvatarImage
                className="object-contain"
                src={session?.user?.image ? session.user.image : "/logos/logo.webp"}
                alt={session?.user?.name || "User Avatar"}
              />
              <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </EditProfilePanel>
        </div>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useSidebar } from "@components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { EditProfilePanel } from "@components/edit-profile-panel";
import { cn } from "@lib/utils";
import { usePathname } from "@i18n/routing";

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const tNavPages = useTranslations("common.nav-pages");
  const { toggleSidebar, state } = useSidebar();

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
            <Avatar className="border-brand-primary h-9 w-9 border-2 transition-transform hover:scale-105">
              <AvatarImage className="object-contain" src="/logos/logo.webp" alt="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </EditProfilePanel>
        </div>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";

import { ExternalLink, HelpCircle, MessageSquare, Plus, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";

import { CreateHouseholdPanel } from "@app/_components/create-household-panel";
import { ManageHouseholdSheet } from "@app/_components/manage-household-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@app/_components/ui/avatar";
import { Button } from "@app/_components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@app/_components/ui/sidebar";
import { Link } from "@app/_i18n/routing";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";

export function AppSidebar({ className }: { className?: string }) {
  const households = useHouseholdStore((state) => state.households);
  const selectedHouseholdId = useHouseholdStore((state) => state.selectedHouseholdId);
  const selectHousehold = useHouseholdStore((state) => state.selectHousehold);

  const tCommon = useTranslations("common");

  return (
    <Sidebar className={cn(className)}>
      <SidebarContent>
        <SidebarGroup className="gap-2 pr-4">
          <SidebarGroupLabel>{tCommon("households")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {households.map((household) => (
                <HouseholdMenuItem
                  key={household.id}
                  isSelected={household.id === selectedHouseholdId}
                  handleClick={() => selectHousehold(household.id)}
                  householdId={household.id}
                  householdIcon={household.icon}
                >
                  <span className="truncate">{household.name}</span>
                </HouseholdMenuItem>
              ))}
              <SidebarMenuItem>
                <CreateHouseholdPanel className="text-muted-foreground hover:text-primary hover:bg-muted flex w-fit gap-2 rounded-lg px-4 py-2 transition-colors">
                  <Plus className="h-5 w-5" />
                  <div>
                    {tCommon("add")} <span className="lowercase">{tCommon("household")}</span>
                  </div>
                </CreateHouseholdPanel>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-0 py-2">
        <SidebarMenu>
          {[
            { href: "https://mica.eco/contact", icon: MessageSquare, text: tCommon("contactUs") },
            { href: "https://mica.eco/faqs", icon: HelpCircle, text: tCommon("help") },
            {
              href: "https://mica.eco",
              icon: () => (
                <Image src="/logos/logo-dark.webp" width={24} height={24} alt="dark logo" />
              ),
              text: "www.mica.eco",
            },
          ].map(({ href, icon: Icon, text }) => (
            <Link key={href} href={href} target="_blank">
              <SidebarMenuItem className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <Icon />
                  {text}
                </div>
                <ExternalLink />
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

interface HouseholdMenuItemProps {
  children: React.ReactNode;
  isSelected: boolean;
  handleClick: () => void;
  householdId: string;
  householdIcon?: string;
}

function HouseholdMenuItem({
  children,
  isSelected,
  handleClick,
  householdId,
  householdIcon,
}: HouseholdMenuItemProps) {
  return (
    <SidebarMenuItem className="group/household flex w-full gap-0">
      <SidebarMenuButton
        onClick={handleClick}
        className={cn(
          "peer h-9 grow rounded-r-none",
          isSelected
            ? "bg-brand-secondary hover:bg-brand-secondary active:bg-brand-secondary transition-colors"
            : "bg-muted hover:bg-brand-tertiary active:bg-brand-tertiary transition-colors"
        )}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src={householdIcon} alt="household" />
          <AvatarFallback>
            <Image src="/icons/household.webp" alt="household" width={128} height={128} />
          </AvatarFallback>
        </Avatar>
        {children}
      </SidebarMenuButton>

      <ManageHouseholdSheet householdId={householdId}>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "group/btn h-9 w-9 rounded-l-none border-l-0 px-0",
            isSelected
              ? "bg-brand-secondary hover:bg-brand-secondary group-hover/household:bg-brand-secondary active:bg-brand-secondary border-brand-secondary"
              : "bg-muted hover:bg-brand-tertiary group-hover/household:bg-brand-tertiary active:bg-brand-tertiary border-muted"
          )}
        >
          <SquarePen className="text-muted-foreground group-hover/btn:text-primary h-4 w-4 transition-colors" />
        </Button>
      </ManageHouseholdSheet>
    </SidebarMenuItem>
  );
}

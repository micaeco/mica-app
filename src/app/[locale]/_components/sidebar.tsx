"use client";

import { useTranslations } from "next-intl";
import { Plus, SquarePen, Bell, CircleHelp, ChevronRight } from "lucide-react";

import { CreateHouseholdPanel } from "./create-household-panel";
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
} from "@components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { LanguageSwitcher } from "./language-switcher";
import { useHouseholdStore } from "@stores/household.store";
import { Separator } from "@components/ui/separator";
import { cn } from "@/lib/utils";
import { EditHouseholdSheet } from "./edit-household-sheet";
import { Link } from "@/i18n/routing";

export function AppSidebar({ className }: { className?: string }) {
  const { selectedHouseholdId, households, updateSelectedHousehold } = useHouseholdStore();
  const common = useTranslations("common");

  return (
    <Sidebar className={cn(className)}>
      <SidebarContent>
        <SidebarGroup className="gap-2 pr-4">
          <SidebarGroupLabel>
            <p className="text-sm font-semibold">{common("households")}</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {households.map((household) => (
                <HouseholdMenuItem
                  key={household.id}
                  isSelected={household.id === selectedHouseholdId}
                  handleClick={() => updateSelectedHousehold(household.id)}
                  householdId={household.id}
                >
                  {household.name}
                </HouseholdMenuItem>
              ))}
              <SidebarMenuItem className="mt-2">
                <CreateHouseholdPanel className="text-muted-foreground hover:text-primary flex w-fit gap-2 px-4 transition-colors">
                  <Plus className="h-5 w-5" />
                  <div>
                    {common("add")} <span className="lowercase">{common("household")}</span>
                  </div>
                </CreateHouseholdPanel>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="mb-4 w-full" />
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <LanguageSwitcher />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="#">
              <SidebarMenuButton>
                <Bell />
                {common("notifications")}
                <ChevronRight className="ml-auto" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="#">
              <SidebarMenuButton>
                <CircleHelp />
                {common("help")}
                <ChevronRight className="ml-auto" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
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
}

function HouseholdMenuItem({
  children,
  isSelected,
  handleClick,
  householdId,
}: HouseholdMenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleClick}
        className={cn(
          "h-9",
          isSelected
            ? "bg-brand-secondary hover:bg-brand-secondary active:bg-brand-secondary transition-colors"
            : "bg-muted hover:bg-brand-tertiary active:bg-brand-tertiary transition-colors"
        )}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src="/icons/household.webp" alt="household" />
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
        <div className="flex w-full items-center justify-between">
          {children}
          <EditHouseholdSheet householdId={householdId}>
            <SquarePen className="text-muted-foreground hover:text-primary h-5 w-5 transition-colors" />
          </EditHouseholdSheet>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

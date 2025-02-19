"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronsUpDown, LogOut, Plus, SquarePen } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { LanguageSwitcher } from "@components/language-switcher";
import { useHouseholdStore } from "@stores/household.store";
import { Separator } from "@components/ui/separator";
import { getNavSettings } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { EditHouseholdSheet } from "./edit-household-sheet";

export function AppSidebar({ className }: { className?: string }) {
  const { selectedHouseholdId, households, updateSelectedHousehold } = useHouseholdStore();
  const common = useTranslations("common");

  return (
    <Sidebar className={cn(className)}>
      <SidebarContent>
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel>
            <p className="text-sm font-semibold">{common("households")}</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 pr-8">
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
            <SidebarMenuButton asChild>
              <LanguageSwitcher />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">M</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs">admin@mica.eco</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg" side="bottom" align="end" sideOffset={4}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">M</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin</span>
                      <span className="truncate text-xs">admin@mica.eco</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {getNavSettings(common).map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="gap-2">
                    <LogOut className="h-4 w-4" />
                    {common("logout")}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

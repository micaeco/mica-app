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
} from "@/app/_components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import LanguageSwitcher from "@/app/_components/language-switcher";
import { useHouseholdStore } from "@/app/_stores/household.store";
import { Separator } from "@/app/_components/ui/separator";
import { getNavSettings } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { EditHouseholdSheet } from "./edit-household-sheet";

interface HouseholdMenuItemProps {
  children: React.ReactNode;
  isSelected: boolean;
  handleClick: () => void;
}

export function HouseholdMenuItem({ children, isSelected, handleClick }: HouseholdMenuItemProps) {
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
          <EditHouseholdSheet>
            <SquarePen className="text-muted-foreground hover:text-primary h-5 w-5 transition-colors" />
          </EditHouseholdSheet>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function SidebarComponent({ className }: { className?: string }) {
  const { selectedHouseholdId, households, updateSelectedHousehold, addHousehold } =
    useHouseholdStore();
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
                >
                  {household.name}
                </HouseholdMenuItem>
              ))}
              <SidebarMenuItem>
                <CreateHouseholdPanel className="text-muted-foreground hover:text-primary flex w-fit gap-2 px-4 transition-colors">
                  <Plus className="h-5 w-5" /> Afegeix vivenda
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

"use client";

import { useState } from "react";

import Image from "next/image";

import { ChevronRight, House, LogOut, Plus, Settings, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { CreateInvitationDialog } from "@app/_components/create-invitation-dialog";
import { DeleteHouseholdDialog } from "@app/_components/delete-household-dialog";
import { EditHouseholdSheet } from "@app/_components/edit-household-sheet";
import { LeaveHouseholdDialog } from "@app/_components/leave-household-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@app/_components/ui/avatar";
import { MenuItem, MenuList } from "@app/_components/ui/menu-list";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@app/_components/ui/sheet";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";
import { KeysOfType } from "@app/_types/utils";

interface ManageHouseholdMenuItems {
  icon: React.ReactNode;
  label: KeysOfType<IntlMessages["common"], string>;
  className?: string;
  onClick?: () => void;
}

export function ManageHouseholdSheet({
  children,
  householdId,
}: {
  children: React.ReactNode;
  householdId: string;
}) {
  const tCommon = useTranslations("common");

  const [isEditHouseholdOpen, setIsEditHouseholdOpen] = useState(false);
  const [showCreateInvitation, setShowCreateInvitation] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const { households } = useHouseholdStore();
  const household = households.find((h) => h.id === householdId);

  const menuItems: ManageHouseholdMenuItems[] = [
    {
      icon: <House />,
      label: "household",
      onClick: () => setIsEditHouseholdOpen(true),
    },
    {
      icon: <Settings />,
      label: "sensor",
      onClick: () => {},
    },
    {
      icon: <LogOut />,
      label: "leave",
      className: "text-destructive",
      onClick: () => setShowConfirmLeave(true),
    },
    {
      icon: <Trash2 className="text-destructive" />,
      label: "delete",
      className: "text-destructive",
      onClick: () => setShowConfirmDelete(true),
    },
  ];

  const { data: users, isLoading } = trpc.household.getUsers.useQuery({
    householdId,
  });

  if (!household) {
    return <div>Household not found</div>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="from-brand-secondary flex w-full flex-col gap-6 bg-gradient-to-b from-5% to-white to-45% pt-16">
        <SheetHeader className="flex items-center justify-center">
          <Image
            src={household.icon || "/icons/household.webp"}
            className="rounded-full"
            alt={household.name}
            width={64}
            height={64}
          />
          <SheetTitle>{household.name}</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-center gap-2">
          {users &&
            !isLoading &&
            users.length > 0 &&
            users.map((user) => (
              <Avatar key={user.id} className="border-brand-primary border-2 bg-white">
                <AvatarImage
                  className="object-contain"
                  src={user?.image ? user.image : "/logos/logo.webp"}
                  alt={user?.name || "User Avatar"}
                />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            ))}
          <button
            onClick={() => {
              setShowCreateInvitation(true);
            }}
            className="border-primary flex items-center justify-center rounded-full border-2 p-1 transition-transform hover:scale-105"
          >
            <Plus size={20} />
          </button>
        </div>

        <MenuList className="mr-2 flex flex-col">
          {menuItems.map((item, index) => {
            return (
              <MenuItem
                key={index}
                onClick={item.onClick}
                className={cn("flex items-center justify-between", item.className)}
              >
                <div className="flex items-center space-x-3">
                  <span className={cn("text-neutral-500", item.className)}>{item.icon}</span>
                  <span>{tCommon(item.label)}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </MenuItem>
            );
          })}
        </MenuList>

        <EditHouseholdSheet
          householdId={householdId}
          isOpen={isEditHouseholdOpen}
          setIsOpen={setIsEditHouseholdOpen}
        />

        <DeleteHouseholdDialog
          household={household}
          isOpen={showConfirmDelete}
          setIsOpen={setShowConfirmDelete}
        />

        <LeaveHouseholdDialog
          householdId={householdId}
          isOpen={showConfirmLeave}
          setIsOpen={setShowConfirmLeave}
        />

        <CreateInvitationDialog
          isOpen={showCreateInvitation}
          setIsOpen={setShowCreateInvitation}
          householdId={householdId}
        />
      </SheetContent>
    </Sheet>
  );
}

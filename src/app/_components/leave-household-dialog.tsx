"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@app/_components/ui/dialog";
import { trpc } from "@app/_lib/trpc";

export function LeaveHouseholdDialog({
  householdId,
  isOpen,
  setIsOpen,
}: {
  householdId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const tErrors = useTranslations("common.errors");
  const tLeaveHousehold = useTranslations("leaveHousehold");

  const utils = trpc.useUtils();
  const leaveMutation = trpc.household.leave.useMutation({
    onSuccess: () => {
      utils.household.invalidate();
      toast.success(tLeaveHousehold("success"));
      setIsOpen(false);
    },
    onError: (error) => {
      const errorCode = error.data?.code || "INTERNAL_SERVER_ERROR";
      toast.error(tErrors.has(errorCode) ? tErrors(errorCode) : tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const handleLeave = () => {
    leaveMutation.mutate({ householdId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tLeaveHousehold("title")}</DialogTitle>
          <DialogDescription>{tLeaveHousehold("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            {tLeaveHousehold("cancel")}
          </Button>
          <Button variant="destructive" onClick={handleLeave} disabled={leaveMutation.isPending}>
            {leaveMutation.isPending && <Loader2 className="mr-2 animate-spin" />}
            {tLeaveHousehold("confirmLeave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

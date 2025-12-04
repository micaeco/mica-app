import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@app/_components/ui/alert-dialog";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { Household } from "@domain/entities/household";

export function DeleteHouseholdDialog({
  household,
  isOpen,
  setIsOpen,
}: {
  household: Household;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const t = useTranslations("deleteHousehold");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const deleteHousehold = useHouseholdStore((state) => state.deleteHousehold);

  const utils = trpc.useUtils();
  const deleteMutation = trpc.household.delete.useMutation({
    onSuccess: () => {
      deleteHousehold(household.id);
      utils.household.invalidate();
      toast.success(t("success"));
      setIsOpen(false);
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const handleDeleteHousehold = () => {
    if (household) {
      deleteMutation.mutate({ sensorId: household.sensorId, householdId: household.id });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col space-y-2">
            <span>
              {t("confirmDescriptionBold", {
                householdName: household?.name,
              })}
            </span>
            <span className="bg-destructive/10 text-destructive rounded p-3 text-xs">
              {t("confirmDescriptionText")}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteHousehold}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
          >
            {deleteMutation.isPending && <Loader2 className="mr-2 animate-spin" />}
            {t("confirmDelete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useTranslations } from "next-intl";

import { EditEventForm } from "@app/_components/edit-event-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@app/_components/ui/sheet";
import { Event } from "@domain/entities/event";

export function EditEventSheet({
  event,
  open,
  onOpenChange,
}: {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmitSuccess?: () => void;
}) {
  const tCommon = useTranslations("common");

  const handleSheetOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {tCommon("edit")} <span className="lowercase">{tCommon("event")}</span>
          </SheetTitle>
        </SheetHeader>

        <EditEventForm
          event={event}
          onFormSubmitSuccess={() => {
            onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

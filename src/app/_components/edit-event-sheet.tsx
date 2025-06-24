"use client";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { EditEventForm } from "@app/_components/edit-event-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@app/_components/ui/sheet";
import { getDateFnsLocale } from "@app/_i18n/routing";
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
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

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
          {event && (
            <SheetDescription>
              {format(event.startTimestamp, "cccc PPP", { locale: dateFnsLocale })}
              <br />
              {format(event.startTimestamp, "HH:mm:ss", { locale: dateFnsLocale })} -{" "}
              {event.endTimestamp
                ? format(event.endTimestamp, "HH:mm:ss", { locale: dateFnsLocale })
                : tCommon("in-progress")}
              <br />
              <br />
              <p className="text-brand-secondary font-bold">
                {event.consumptionInLiters.toFixed(1)} L
              </p>
            </SheetDescription>
          )}
        </SheetHeader>

        <br />

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

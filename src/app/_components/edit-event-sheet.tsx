"use client";

import { useTranslations } from "next-intl";

import { EditEventForm } from "@app/_components/edit-event-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@app/_components/ui/sheet";
import { Event } from "@domain/entities/event";

import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import { categoryMap } from "@domain/entities/category";

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
  const tCategories = useTranslations("common.categories");

  const handleSheetOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2">
              <Image
                src={categoryMap[event.category].icon!}
                alt={event.category}
                width={32}
                height={32}
              />
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{tCategories(event.category)}</span>
                {event.categorizationState === "ai_high_confidence" && (
                  <Sparkles className="text-brand-primary fill-brand-primary size-4" />
                )}
                {event.categorizationState === "ai_confirmed" && (
                  <div className="relative inline-flex">
                    <Sparkles className="text-brand-secondary fill-brand-secondary size-3" />
                    <Check className="text-brand-secondary size-3" />
                  </div>
                )}
              </div>
            </div>
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

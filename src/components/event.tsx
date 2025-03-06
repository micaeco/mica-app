"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Timer } from "lucide-react";

import { Event } from "@core/entities/event";

export function EventBar({ event, totalConsumption }: { event: Event; totalConsumption: number }) {
  const tCommon = useTranslations("common");
  const consumptionPercentage = (event.consumptionInLiters / totalConsumption) * 100;

  if (event.endDate) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Image src={event.category.icon} alt={event.category.type} width={32} height={32} />

        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-between">
            <span className="font-medium">{event.category.type}</span>
            {event.label && (
              <span className="bg-brand-tertiary/60 rounded-full px-3 py-0.5 text-xs">
                {event.label.name}
              </span>
            )}
            <span>
              {event.startDate.toLocaleTimeString()} - {event.endDate.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex flex-row gap-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted-foreground flex flex-row justify-between p-2">
      <Timer size={32} />
      <div>
        <span>{tCommon("new")}</span> <span className="lowercase">{tCommon("event")}</span>
      </div>
      <span>{tCommon("now")}</span>
    </div>
  );
}

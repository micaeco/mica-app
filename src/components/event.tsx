"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Timer } from "lucide-react";

import { Event } from "@core/entities/event";

export function EventBar({ event, totalConsumption }: { event: Event; totalConsumption: number }) {
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  const consumptionPercentage = (event.consumptionInLiters / totalConsumption) * 100;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  if (event.endDate) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Image src={event.category.icon} alt={event.category.type} width={32} height={32} />

        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between gap-2">
            <div className="space-x-2">
              <span className="font-medium">{tCategories(event.category.type)}</span>
              {event.label && (
                <span className="bg-brand-tertiary/60 rounded-full px-3 py-0.5 text-xs first-letter:capitalize">
                  {event.label.name}
                </span>
              )}
            </div>
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="bg-muted mt-1 h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-brand-secondary h-full rounded-full"
                style={{
                  width: `${consumptionPercentage}%`,
                }}
                title={`${Math.round(consumptionPercentage)}% of total consumption`}
              />
            </div>
            <span className="text-brand-secondary font-bold">
              {event.consumptionInLiters}&nbsp;L
            </span>
          </div>
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

"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Timer } from "lucide-react";
import { format } from "date-fns";

import { Event } from "@core/entities/event";
import { getDateFnsLocale } from "@lib/utils";
import { ConsumptionBar } from "@components/consumption-bar";

export function EventBar({ event, totalConsumption }: { event: Event; totalConsumption: number }) {
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const consumptionPercentage = (event.consumptionInLiters / totalConsumption) * 100;

  if (event.endDate) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Image src={event.category.icon} alt={event.category.type} width={32} height={32} />

        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row space-x-2">
              <span className="font-medium">{tCategories(event.category.type)}</span>
              {event.label && (
                <div className="bg-brand-secondary flex items-center justify-center rounded-full px-3 py-0.5 text-xs">
                  {event.label.name}
                </div>
              )}
            </div>
            <span>
              {format(event.startDate, "HH:mm", { locale: dateLocale })} -{" "}
              {format(event.endDate, "HH:mm", { locale: dateLocale })}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ConsumptionBar consumptionPercentage={consumptionPercentage} />
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

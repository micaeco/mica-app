"use client";

import Image from "next/image";

import { format } from "date-fns";
import { Timer } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { categoryMap } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { ConsumptionBar } from "@presentation/components/consumption-bar";
import { getDateFnsLocale } from "@presentation/lib/utils";

interface EventBarProps {
  event: Event;
  totalConsumption: number;
}

export function EventBar({ event, totalConsumption }: EventBarProps) {
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const consumptionPercentage = (event.consumptionInLiters / totalConsumption) * 100;

  if (event.endDate) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Image src={categoryMap[event.category].icon} alt={event.category} width={32} height={32} />

        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row space-x-2">
              <span className="max-w-[6ch] truncate font-medium sm:max-w-none">
                {tCategories(event.category)}
              </span>
              {event.tag && (
                <div className="bg-brand-secondary flex items-center justify-center rounded-full px-3 py-0.5 text-xs">
                  <span className="xs:max-w-none max-w-[6ch] truncate">{event.tag}</span>
                </div>
              )}
            </div>
            <span className="line-clamp-1">
              {format(event.startDate, "HH:mm", { locale: dateLocale })} –{" "}
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

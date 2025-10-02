"use client";

import { useState } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { Sparkles, Timer } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { ConsumptionBar } from "@app/_components/consumption-bar";
import { EditEventSheet } from "@app/_components/edit-event-sheet";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { categoryMap } from "@domain/entities/category";
import { Granularity } from "@domain/entities/consumption";
import { Event } from "@domain/entities/event";

interface EventBarProps {
  event: Event;
  totalConsumption: number;
  granularity?: Granularity;
}

export function EventBar({ event, totalConsumption, granularity }: EventBarProps) {
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const [isOpenEditEventSheet, setIsOpenEditEventSheet] = useState<boolean>(false);

  const consumptionPercentage = (event.consumptionInLiters / totalConsumption) * 100;

  if (event.endTimestamp) {
    return (
      <>
        <div
          className="flex flex-row items-center gap-2 transition-transform hover:scale-95 hover:cursor-pointer"
          onClick={() => setIsOpenEditEventSheet(true)}
        >
          <Image
            src={categoryMap[event.category].icon!}
            alt={event.category}
            width={32}
            height={32}
          />

          <div className="flex w-full flex-col">
            <div className="flex flex-row justify-between gap-2">
              <div className="flex min-w-0 flex-row space-x-2">
                <span className="flex-shrink flex-grow-0 truncate font-medium">
                  {tCategories(event.category)}
                </span>
                {event.categorySource === "algorithm" && (
                  <Sparkles className="text-brand-primary fill-brand-primary size-3" />
                )}
                {event.tag && (
                  <div className="bg-brand-secondary flex flex-shrink items-center justify-center rounded-full px-3 py-0.5 text-xs">
                    <span className="truncate">{event.tag.name}</span>
                  </div>
                )}
              </div>
              <span className="line-clamp-1">
                {granularity === "month" || granularity === "week"
                  ? format(event.startTimestamp, "eeee d", { locale: dateLocale })
                  : format(event.startTimestamp, "HH:mm", { locale: dateLocale }) +
                    " – " +
                    format(event.endTimestamp, "HH:mm", { locale: dateLocale })}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <ConsumptionBar consumptionPercentage={consumptionPercentage} />
              <span className="text-brand-secondary font-bold">
                {event.consumptionInLiters.toFixed(1)}&nbsp;L
              </span>
            </div>
          </div>
        </div>

        <EditEventSheet
          event={event}
          open={isOpenEditEventSheet}
          onOpenChange={setIsOpenEditEventSheet}
        />
      </>
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

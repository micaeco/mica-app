"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ConsumptionPerCategoryChart } from "@app/[locale]/consumption/_components/consumption-per-category-chart";
import { ConsumptionPerEventChart } from "@app/[locale]/consumption/_components/consumption-per-event-chart";
import { ConsumptionPerTimeChart } from "@app/[locale]/consumption/_components/consumption-per-time-chart";
import { TimeGranularitySelect } from "@app/[locale]/consumption/_components/time-granularity-select";
import { useConsumption } from "@app/[locale]/consumption/_hooks/use-consumption";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@app/_components/ui/card";
import { Skeleton } from "@app/_components/ui/skeleton";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { Category } from "@domain/entities/category";

export default function ConsumptionPage() {
  const locale = useLocale();
  const tCommon = useTranslations("common");

  const {
    granularity,
    setGranularity,
    selectedTimeWindow,
    setSelectedTimeWindow,
    consumption,
    isLoading: isLoadingConsumption,
    moveTimeWindow,
    canMoveTimeWindowForward,
    canMoveTimeWindowBackward,
  } = useConsumption();

  const [selectedCategories, setSelectedCategories] = useState<Category[] | undefined>(undefined);

  const currentConsumption = consumption.find(
    (item) =>
      selectedTimeWindow &&
      item.startDate.getTime() === selectedTimeWindow.startDate.getTime() &&
      item.endDate.getTime() === selectedTimeWindow.endDate.getTime()
  );

  const dateFnsLocale = getDateFnsLocale(locale);

  const formatSelectedTimeWindow = () => {
    if (!selectedTimeWindow) return tCommon("no-data");

    const { startDate, endDate } = selectedTimeWindow;
    const sameYear = startDate.getFullYear() === endDate.getFullYear();

    if (granularity === "hour") {
      const startHour = format(startDate, "HH:mm");
      const endHour = format(endDate, "HH:mm");
      return `${format(startDate, "dd MMMM y", { locale: dateFnsLocale })} | ${startHour} - ${endHour}`;
    } else if (granularity === "day") {
      return format(startDate, "dd MMMM y", { locale: dateFnsLocale });
    } else if (granularity === "week") {
      return `${format(startDate, "dd MMMM", { locale: dateFnsLocale })} - ${format(endDate, sameYear ? "dd MMMM y" : "dd MMMM y", { locale: dateFnsLocale })}`;
    } else if (granularity === "month") {
      return format(startDate, "MMMM y", { locale: dateFnsLocale });
    } else {
      return `${format(startDate, "dd MMMM y", { locale: dateFnsLocale })} - ${format(endDate, "dd MMMM y", { locale: dateFnsLocale })}`;
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <TimeGranularitySelect granularity={granularity} setGranularity={setGranularity} />

      <div className="flex flex-col gap-4 2xl:flex-row">
        <div className="flex flex-col gap-4 2xl:min-w-md">
          <Card className="flex h-full flex-col">
            <CardContent className="flex flex-grow flex-col items-center justify-center px-2 pt-6">
              <ConsumptionPerTimeChart
                selectedTimeWindow={selectedTimeWindow}
                setSelectedTimeWindow={setSelectedTimeWindow}
                granularity={granularity}
                consumption={consumption}
                moveTimeWindow={moveTimeWindow}
                canMoveTimeWindowForward={canMoveTimeWindowForward}
                canMoveTimeWindowBackward={canMoveTimeWindowBackward}
                isLoading={isLoadingConsumption}
              />
            </CardContent>
          </Card>

          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="space-x-4">
                {isLoadingConsumption ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <div className="flex flex-col gap-4">
                    <span className="font-medium first-letter:capitalize">
                      {formatSelectedTimeWindow()}
                    </span>
                    <div className="flex flex-row gap-2">
                      <span className="text-2xl">
                        {currentConsumption?.consumptionInLiters.toFixed(2) ?? "--"} L
                      </span>
                      <span className="text-muted-foreground flex items-end text-sm font-light">
                        {currentConsumption &&
                        currentConsumption.consumptionPercentDeviationFromBaseline > 0 ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                        {currentConsumption &&
                          Math.abs(
                            currentConsumption?.consumptionPercentDeviationFromBaseline
                          ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {isLoadingConsumption ? (
                  <Skeleton className="h-5 w-40" />
                ) : (
                  <>
                    {currentConsumption?.consumptionInLitersPerDayPerPerson.toFixed(2) ?? "--"} L /{" "}
                    {tCommon("person")} {tCommon("day")}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col items-center justify-center">
              <ConsumptionPerCategoryChart
                categoryBreakdown={currentConsumption?.categoryBreakdown || []}
                setSelectedCategories={setSelectedCategories}
                isLoading={isLoadingConsumption}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="flex w-full flex-col 2xl:max-h-[calc(140vh-250px)] 2xl:min-h-[calc(100vh-250px)] 2xl:flex-grow">
          <CardContent className="flex-grow p-6 2xl:overflow-y-auto">
            <ConsumptionPerEventChart
              selectedCategories={selectedCategories}
              selectedTimeWindow={selectedTimeWindow}
              granularity={granularity}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

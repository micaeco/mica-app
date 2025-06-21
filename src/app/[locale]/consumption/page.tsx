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
  const t = useTranslations("consumption-per-time-chart");
  const tCommon = useTranslations("common");

  const {
    granularity,
    setGranularity,
    selectedTimeWindow,
    setSelectedTimeWindow,
    consumption,
    isLoading: isLoadingConsumption,
    error: errorConsumption,
    moveTimeWindow,
    canMoveTimeWindowForward,
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
      return `${format(startDate, "dd MMM y", { locale: dateFnsLocale })} | ${startHour} - ${endHour}`;
    } else if (granularity === "day") {
      return format(startDate, "dd MMM y", { locale: dateFnsLocale });
    } else if (granularity === "week") {
      return `${format(startDate, "dd MMM", { locale: dateFnsLocale })} - ${format(endDate, sameYear ? "dd MMM y" : "dd MMM y", { locale: dateFnsLocale })}`;
    } else if (granularity === "month") {
      return format(startDate, "MMM y", { locale: dateFnsLocale });
    } else {
      return `${format(startDate, "dd MMM y", { locale: dateFnsLocale })} - ${format(endDate, "dd MMM y", { locale: dateFnsLocale })}`;
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <TimeGranularitySelect granularity={granularity} setGranularity={setGranularity} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="flex h-full flex-col xl:w-1/2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isLoadingConsumption ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  formatSelectedTimeWindow()
                )}
              </CardTitle>
              <CardDescription>
                {t("description", { granularity: tCommon(granularity) })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col items-center justify-center px-2">
              <ConsumptionPerTimeChart
                selectedTimeWindow={selectedTimeWindow}
                setSelectedTimeWindow={setSelectedTimeWindow}
                granularity={granularity}
                consumption={consumption}
                moveTimeWindow={moveTimeWindow}
                canMoveTimeWindowForward={canMoveTimeWindowForward}
                isLoading={isLoadingConsumption}
                error={errorConsumption}
              />
            </CardContent>
          </Card>

          <Card className="flex h-full flex-col xl:w-1/2">
            <CardHeader>
              <CardTitle className="space-x-4">
                {isLoadingConsumption ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <div className="flex items-end gap-4">
                    <span className="text-2xl">
                      {currentConsumption?.consumptionInLiters ?? "--"} L
                    </span>
                    <p className="flex items-center">
                      {currentConsumption &&
                      currentConsumption.consumptionPercentDeviationFromBaseline > 0 ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                      {currentConsumption &&
                        Math.abs(currentConsumption?.consumptionPercentDeviationFromBaseline)}
                      %
                    </p>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {isLoadingConsumption ? (
                  <Skeleton className="h-5 w-40" />
                ) : (
                  <>
                    {currentConsumption?.consumptionInLitersPerDayPerPerson ?? "--"} L /{" "}
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
                error={errorConsumption}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <ConsumptionPerEventChart
              selectedCategories={selectedCategories}
              selectedTimeWindow={selectedTimeWindow}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

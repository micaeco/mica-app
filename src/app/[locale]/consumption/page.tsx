"use client";

import { useState } from "react";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { ConsumptionPerCategoryChart } from "@app/[locale]/consumption/_components/consumption-per-category-chart";
import { ConsumptionPerEventChart } from "@app/[locale]/consumption/_components/consumption-per-event-chart";
import { ConsumptionPerTimeChart } from "@app/[locale]/consumption/_components/consumption-per-time-chart";
import { TimeResolutionSelect } from "@app/[locale]/consumption/_components/time-resolution-select";
import { useConsumption } from "@app/[locale]/consumption/_hooks/use-consumption";
import { Category } from "@domain/entities/category";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@presentation/components/ui/card";
import { Skeleton } from "@presentation/components/ui/skeleton";
import { getDateFnsLocale } from "@presentation/i18n/routing";
import { cn } from "@presentation/lib/utils";

export default function ConsumptionPage() {
  const locale = useLocale();
  const t = useTranslations("consumption-per-time-chart");
  const tCommon = useTranslations("common");

  const {
    resolution,
    setResolution,
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

    if (resolution === "hour") {
      const startHour = format(startDate, "HH:mm");
      const endHour = format(endDate, "HH:mm");
      return `${format(startDate, "dd MMM y", { locale: dateFnsLocale })} | ${startHour} - ${endHour}`;
    } else if (resolution === "day") {
      return format(startDate, "dd MMM y", { locale: dateFnsLocale });
    } else if (resolution === "week") {
      return `${format(startDate, "dd MMM", { locale: dateFnsLocale })} - ${format(endDate, sameYear ? "dd MMM y" : "dd MMM y", { locale: dateFnsLocale })}`;
    } else if (resolution === "month") {
      return format(startDate, "MMM y", { locale: dateFnsLocale });
    } else {
      return `${format(startDate, "dd MMM y", { locale: dateFnsLocale })} - ${format(endDate, "dd MMM y", { locale: dateFnsLocale })}`;
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <TimeResolutionSelect resolution={resolution} setResolution={setResolution} />

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
                {t("description", { resolution: tCommon(resolution) })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col items-center justify-center px-2">
              <ConsumptionPerTimeChart
                selectedTimeWindow={selectedTimeWindow}
                setSelectedTimeWindow={setSelectedTimeWindow}
                resolution={resolution}
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
                  <>
                    <span className="text-2xl">
                      {currentConsumption?.consumptionInLiters ?? "--"} L
                    </span>
                    {currentConsumption?.consumptionPercentDeviationFromBaseline !== undefined && (
                      <span
                        className={cn(
                          "text-sm",
                          currentConsumption.consumptionPercentDeviationFromBaseline > 0
                            ? "text-red-500"
                            : "text-green-500"
                        )}
                      >
                        {currentConsumption.consumptionPercentDeviationFromBaseline}%
                        {currentConsumption.consumptionPercentDeviationFromBaseline > 0
                          ? " ↑"
                          : " ↓"}
                      </span>
                    )}
                  </>
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

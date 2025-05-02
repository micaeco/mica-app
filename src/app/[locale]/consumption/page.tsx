"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@presentation/components/ui/card";
import { cn, getDateFnsLocale } from "@presentation/lib/utils";
import { useConsumption } from "@app/[locale]/consumption/_hooks/use-consumption";
import { ConsumptionPerTimeChart } from "@app/[locale]/consumption/_components/consumption-per-time-chart";
import { ConsumptionPerCategoryChart } from "@app/[locale]/consumption/_components/consumption-per-category-chart";
import { ConsumptionPerEventChart } from "@app/[locale]/consumption/_components/consumption-per-event-chart";
import { TimeResolutionSelect } from "@app/[locale]/consumption/_components/time-resolution-select";
import { format } from "date-fns";

export default function ConsumptionPage() {
  const {
    selectedTimeWindow,
    setSelectedTimeWindow,
    moveTimeWindow,
    canMoveTimeWindowForward,
    resolution,
    setResolution,
    selectedCategories,
    setSelectedCategories,
    consumption,
    events,
  } = useConsumption();

  const locale = useLocale();
  const t = useTranslations("consumption-per-time-chart");
  const tCommon = useTranslations("common");

  const currentConsumption = consumption.find(
    (item) =>
      item.startDate.getTime() === selectedTimeWindow.startDate.getTime() &&
      item.endDate.getTime() === selectedTimeWindow.endDate.getTime()
  );

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {/* Controls section */}
      <TimeResolutionSelect resolution={resolution} setResolution={setResolution} />

      {/* Charts section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="h-full xl:w-1/2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {(() => {
                  const dateFnsLocale = getDateFnsLocale(locale);
                  const sameYear =
                    selectedTimeWindow.startDate.getFullYear() ===
                    selectedTimeWindow.endDate.getFullYear();
                  const sameDay =
                    selectedTimeWindow.startDate.getDate() === selectedTimeWindow.endDate.getDate();
                  const sameHour =
                    selectedTimeWindow.startDate.getHours() ===
                    selectedTimeWindow.endDate.getHours();

                  return sameHour
                    ? `${format(selectedTimeWindow.startDate, "dd MMM y", { locale: dateFnsLocale })} | ${format(selectedTimeWindow.startDate, "HH:mm")} - ${format(selectedTimeWindow.endDate, "HH:mm", { locale: dateFnsLocale })}`
                    : sameDay
                      ? `${format(selectedTimeWindow.startDate, "dd MMM y", { locale: dateFnsLocale })}`
                      : sameYear
                        ? `${format(selectedTimeWindow.startDate, "dd MMM", { locale: dateFnsLocale })} - ${format(selectedTimeWindow.endDate, "dd MMM y", { locale: dateFnsLocale })}`
                        : `${format(selectedTimeWindow.startDate, "dd MMM y", { locale: dateFnsLocale })} - ${format(selectedTimeWindow.endDate, "dd MMM y", { locale: dateFnsLocale })}`;
                })()}
              </CardTitle>
              <CardDescription>
                {t("description", { resolution: tCommon(resolution) })}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <ConsumptionPerTimeChart
                selectedTimeWindow={selectedTimeWindow}
                setSelectedTimeWindow={setSelectedTimeWindow}
                resolution={resolution}
                consumption={consumption}
                moveTimeWindow={moveTimeWindow}
                canMoveTimeWindowForward={canMoveTimeWindowForward}
              />
            </CardContent>
          </Card>

          <Card className="h-full xl:w-1/2">
            <CardHeader>
              <CardTitle className="space-x-4">
                <span className="text-2xl">{currentConsumption?.consumptionInLiters} L</span>
                <span
                  className={cn(
                    "text-sm",
                    (currentConsumption?.consumptionPercentDeviationFromBaseline ?? 0) > 0
                      ? "text-red-500"
                      : "text-green-500"
                  )}
                >
                  {currentConsumption?.consumptionPercentDeviationFromBaseline}%
                  {currentConsumption?.consumptionPercentDeviationFromBaseline !== undefined &&
                    (currentConsumption.consumptionPercentDeviationFromBaseline > 0 ? " ↑" : " ↓")}
                </span>
              </CardTitle>
              <CardDescription>
                {currentConsumption?.consumptionInLitersPerDayPerPerson} L / {tCommon("person")}{" "}
                {tCommon("day")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumptionPerCategoryChart
                categoryBreakdown={currentConsumption?.categoryBreakdown || []}
                setSelectedCategories={setSelectedCategories}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <ConsumptionPerEventChart selectedCategories={selectedCategories} events={events} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

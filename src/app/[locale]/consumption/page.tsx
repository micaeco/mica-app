"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Category } from "@core/entities/category";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { useTimeWindow } from "@app/[locale]/consumption/_hooks/use-time-window";
import { ConsumptionPerTimeChart } from "@app/[locale]/consumption/_components/consumption-per-time-chart";
import { ConsumptionPerCategoryChart } from "@app/[locale]/consumption/_components/consumption-per-category-chart";
import { ConsumptionPerLabelChart } from "@app/[locale]/consumption/_components/consumption-per-event-chart";
import { TimeResolutionSelect } from "@app/[locale]/consumption/_components/time-resolution-select";

export default function ConsumptionPage() {
  const { timeWindow, setTimeWindow, resolution, setResolution, consumption, isLoading } =
    useTimeWindow();
  const [category, setCategory] = useState<Category | undefined>(undefined);

  const tCommon = useTranslations("common");
  const tTime = useTranslations("consumption-per-time-chart");
  const tCategory = useTranslations("consumption-per-category-chart");

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {/* Controls section */}
      <TimeResolutionSelect resolution={resolution} setResolution={setResolution} />

      {/* Charts section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="h-full xl:w-1/2">
            <CardHeader>
              <CardTitle>{tTime("title", { resolution: tCommon(resolution) })}</CardTitle>
              <CardDescription>
                {tTime("description", { resolution: tCommon(resolution) })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumptionPerTimeChart
                timeWindow={timeWindow}
                setTimeWindow={setTimeWindow}
                resolution={resolution}
                consumption={consumption}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="h-full xl:w-1/2">
            <CardHeader>
              <CardTitle>{tCategory("title")}</CardTitle>
              <CardDescription>{tCategory("description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumptionPerCategoryChart
                categoryBreakdown={
                  consumption.find(
                    (categoryBreakdown) =>
                      categoryBreakdown.startDate === timeWindow.startDate &&
                      categoryBreakdown.endDate === timeWindow.endDate
                  )?.categoryBreakdown ?? []
                }
                category={category}
                setCategory={setCategory}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <ConsumptionPerLabelChart timeWindow={timeWindow} category={category} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

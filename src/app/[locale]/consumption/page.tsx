"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ConsumptionPerTimeChart } from "./_components/consumption-per-time-chart";
import { ConsumptionPerDeviceChart } from "./_components/consumption-per-device-chart";
import { ConsumptionPerCategoryChart } from "./_components/consumption-per-category-chart";
import { TimeResolutionSelect } from "./_components/time-resolution-select";
import { DateRangePanel } from "./_components/date-range-panel";
import { useEventsContext } from "@providers/events-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { useTimeWindow } from "@hooks/use-time-window";
import { Category } from "@/lib/types";

export default function Consumption() {
  const { timeWindow, setTimeWindow, resolution, setResolution, data } = useTimeWindow();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const { events } = useEventsContext();

  const common = useTranslations("common");
  const tTime = useTranslations("consumption-per-time-chart");
  const tCategory = useTranslations("consumption-per-category-chart");
  const tDevice = useTranslations("consumption-per-device-chart");

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {/* Controls section */}
      <div className="flex items-center justify-between gap-4 md:justify-normal">
        <DateRangePanel
          timeWindow={timeWindow}
          setTimeWindow={setTimeWindow}
          setResolution={setResolution}
          open={open}
          setOpen={setOpen}
        />
        <TimeResolutionSelect
          resolution={resolution}
          setResolution={setResolution}
          setOpen={setOpen}
        />
      </div>

      {/* Charts section */}
      <div className="flex flex-col gap-4">
        {/* First row wrapper - for Time and Category charts */}
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="h-full xl:w-1/2">
            <CardHeader>
              <CardTitle>
                {resolution === "personalized"
                  ? tTime("title.personalized")
                  : tTime("title.other", { resolution: common(`${resolution}`) })}
              </CardTitle>
              <CardDescription>
                {resolution === "personalized"
                  ? tTime("description.personalized")
                  : tTime("description.other", { resolution: common(`${resolution}`) })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumptionPerTimeChart
                timeWindow={timeWindow}
                setTimeWindow={setTimeWindow}
                resolution={resolution}
                data={data}
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
                timeWindow={timeWindow}
                category={category}
                setCategory={setCategory}
                events={events}
              />
            </CardContent>
          </Card>
        </div>

        {/* Second row - Device chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{tDevice("title")}</CardTitle>
            <CardDescription>{tDevice("description")}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ConsumptionPerDeviceChart
              timeWindow={timeWindow}
              category={category}
              events={events}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

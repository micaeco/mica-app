"use client";

import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ConsumptionPerTimeChart from "@/components/consumption/consumption-per-time-chart";
import ConsumptionPerDeviceChart from "@/components/consumption/consumption-per-device-chart";
import ConsumptionPerCategoryChart from "@/components/consumption/consumption-per-category-chart";
import TimeResolutionDropdown from "@/components/consumption/time-resolution-dropdown";
import DateRangeCalendar from "@/components/consumption/date-range-calendar";
import { useTimeWindow } from "@/hooks/useTimeWindow";
import { useEventsContext } from "@/components/layout/events-provider";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function Consumption() {
  const [mounted, setMounted] = useState(false);
  const { timeWindow, setTimeWindow, resolution, setResolution, data } =
    useTimeWindow();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const { events } = useEventsContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 lg:p-8">
      <div className="flex gap-4 justify-between md:justify-normal items-center">
        {resolution === "personalized" ? (
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">
                {new Date(timeWindow.startDate)?.toLocaleDateString()} -
                {new Date(timeWindow.endDate)?.toLocaleDateString()}
              </Button>
            </DialogTrigger>
            <DialogContent className="justify-center max-w-96">
              <DateRangeCalendar
                timeWindow={timeWindow}
                setTimeWindow={setTimeWindow}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <p className="px-4 font-semibold">
            {new Date(timeWindow.startDate)?.toLocaleDateString()} -
            {new Date(timeWindow.endDate)?.toLocaleDateString()}
          </p>
        )}

        <TimeResolutionDropdown
          timeWindow={timeWindow}
          setTimeWindow={setTimeWindow}
          resolution={resolution}
          setResolution={setResolution}
        />
      </div>
      {resolution === "personalized" ? (
        <div className="flex 2xl:flex-row flex-col gap-4">
          <ConsumptionPerCategoryChart
            timeWindow={timeWindow}
            category={category}
            setCategory={setCategory}
            events={events}
          />
          <ConsumptionPerDeviceChart
            timeWindow={timeWindow}
            category={category}
            events={events}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col 2xl:flex-row gap-4 w-full">
            <div className="2xl:w-1/2">
              <ConsumptionPerTimeChart
                timeWindow={timeWindow}
                setTimeWindow={setTimeWindow}
                resolution={resolution}
                data={data}
              />
            </div>
            <div className="2xl:w-1/2">
              <ConsumptionPerCategoryChart
                timeWindow={timeWindow}
                category={category}
                setCategory={setCategory}
                events={events}
              />
            </div>
          </div>
          <ConsumptionPerDeviceChart
            timeWindow={timeWindow}
            category={category}
            events={events}
          />
        </div>
      )}
    </div>
  );
}

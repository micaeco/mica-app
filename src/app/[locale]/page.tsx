"use client";

import { useState } from "react";

import { useEventsContext } from "@/components/events-provider";
import ConsumptionPerTimeChart from "./components/consumption-per-time-chart";
import ConsumptionPerDeviceChart from "./components/consumption-per-device-chart";
import ConsumptionPerCategoryChart from "./components/consumption-per-category-chart";
import TimeResolutionSelect from "./components/time-resolution-select";
import DateRangeDialog from "./components/date-range-dialog";
import { useTimeWindow } from "@/hooks/use-time-window";
import { Category } from "@/lib/types";

export default function Consumption() {
  const { timeWindow, setTimeWindow, resolution, setResolution, data } =
    useTimeWindow();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const { events } = useEventsContext();

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex gap-4 justify-between md:justify-normal items-center w-full">
        <DateRangeDialog
          timeWindow={timeWindow}
          setTimeWindow={setTimeWindow}
          resolution={resolution}
          setResolution={setResolution}
        />
        <TimeResolutionSelect
          resolution={resolution}
          setResolution={setResolution}
        />
      </div>
      {resolution === "personalized" ? (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <ConsumptionPerCategoryChart
              timeWindow={timeWindow}
              category={category}
              setCategory={setCategory}
              events={events}
            />
          </div>
          <div className="w-full">
            <ConsumptionPerDeviceChart
              timeWindow={timeWindow}
              category={category}
              events={events}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full">
            <div className="w-full">
              <ConsumptionPerTimeChart
                timeWindow={timeWindow}
                setTimeWindow={setTimeWindow}
                resolution={resolution}
                data={data}
              />
            </div>
            <div className="w-full">
              <ConsumptionPerCategoryChart
                timeWindow={timeWindow}
                category={category}
                setCategory={setCategory}
                events={events}
              />
            </div>
          </div>
          <div className="w-full">
            <ConsumptionPerDeviceChart
              timeWindow={timeWindow}
              category={category}
              events={events}
            />
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [open, setOpen] = useState(false);
  const { events } = useEventsContext();

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      {/* Controls section */}
      <div className="flex gap-4 justify-between md:justify-normal items-center">
        <DateRangeDialog
          timeWindow={timeWindow}
          setTimeWindow={setTimeWindow}
          resolution={resolution}
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
        <div className="flex flex-col 2xl:flex-row gap-4">
          {resolution !== "personalized" && (
            <div className="w-full">
              <ConsumptionPerTimeChart
                timeWindow={timeWindow}
                setTimeWindow={setTimeWindow}
                resolution={resolution}
                data={data}
              />
            </div>
          )}
          <div
            className={`w-full ${
              resolution === "personalized" ? "2xl:w-1/2" : ""
            }`}
          >
            <ConsumptionPerCategoryChart
              timeWindow={timeWindow}
              category={category}
              setCategory={setCategory}
              events={events}
            />
          </div>
        </div>

        {/* Second row - Device chart */}
        <div
          className={`w-full ${
            resolution === "personalized" ? "2xl:w-1/2" : ""
          }`}
        >
          <ConsumptionPerDeviceChart
            timeWindow={timeWindow}
            category={category}
            events={events}
          />
        </div>
      </div>
    </div>
  );
}

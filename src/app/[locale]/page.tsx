"use client";

import { useEffect, useState } from "react";

import ConsumptionPerTimeChart from "@/components/consumption/consumption-per-time-chart";
import ConsumptionPerDeviceChart from "@/components/consumption/consumption-per-device-chart";
import ConsumptionPerCategoryChart from "@/components/consumption/consumption-per-category-chart";
import ConsumptionCard from "@/components/consumption/consumption-card";
import ConsumptionHistoric from "@/components/consumption/consumption-historic";
import TimeResolutionTabs from "@/components/consumption/time-resolution-tabs";
import ConsumptionPerPerson from "@/components/consumption/consumption-per-person";
import { useTimeWindow } from "@/hooks/useTimeWindow";
import { useEventsContext } from "@/components/layout/events-provider";
import { Category } from "@/lib/types";

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
      <div className="flex flex-row gap-4">
        <div className="w-full">
          <ConsumptionCard
            data={data}
            timeWindow={timeWindow}
            resolution={resolution}
          />
        </div>
        <div className="w-full hidden md:block">
          <ConsumptionPerPerson
            data={data}
            timeWindow={timeWindow}
            resolution={resolution}
          />
        </div>
        <div className="w-full hidden 2xl:block">
          <ConsumptionHistoric events={events} />
        </div>
      </div>
      <TimeResolutionTabs resolution={resolution} setResolution={setResolution}>
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
            resolution={resolution}
            category={category}
            events={events}
          />
        </div>
      </TimeResolutionTabs>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import { Consumption } from "@core/entities/consumption";
import { ConsumptionResolution, TimeWindow } from "@lib/types";
import { useHouseholdStore } from "@/stores/household";
import {
  getDailyConsumption,
  getHourlyConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
} from "@app/[locale]/consumption/actions";

export function useTimeWindow() {
  const [resolution, setResolution] = useState<ConsumptionResolution>("month");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [consumption, setConsumption] = useState<Consumption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedHouseholdSensorId } = useHouseholdStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const today = new Date();
      const startDate = new Date(today);

      switch (resolution) {
        case "month":
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        case "week":
          startDate.setDate(today.getDate() - 7 * 7);
          break;
        case "day":
          startDate.setDate(today.getDate() - 7);
          break;
        case "hour":
          startDate.setHours(today.getHours() - 7);
          break;
      }

      const result =
        resolution === "month"
          ? await getMonthlyConsumption(selectedHouseholdSensorId, startDate, today)
          : resolution === "week"
            ? await getWeeklyConsumption(selectedHouseholdSensorId, startDate, today)
            : resolution === "day"
              ? await getDailyConsumption(selectedHouseholdSensorId, startDate, today)
              : await getHourlyConsumption(selectedHouseholdSensorId, startDate, today);

      if (result.success) {
        setConsumption(result.data);
        const lastItem = result.data[result.data.length - 1];

        setTimeWindow({
          startDate: lastItem.startDate,
          endDate: lastItem.endDate,
        });
      }

      setIsLoading(false);
    };

    fetchData();
    console.log("Fetched data in ConsumptionPerTimeChart");
  }, [resolution, setTimeWindow, selectedHouseholdSensorId]);

  return { timeWindow, setTimeWindow, resolution, setResolution, consumption, isLoading } as const;
}

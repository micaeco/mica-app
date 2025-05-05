import { useState, useEffect, useCallback, useRef } from "react";

import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  subDays,
  subHours,
  subMonths,
  subWeeks,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  endOfDay,
  endOfHour,
  endOfMonth,
  endOfWeek,
  min,
} from "date-fns";

import {
  getDailyConsumption,
  getHourlyConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
} from "@app/[locale]/consumption/actions";
import { Consumption, ConsumptionGranularity } from "@domain/entities/consumption";
import { ErrorKey } from "@domain/entities/error";
import { TimeWindow } from "@presentation/lib/types";
import { useHouseholdStore } from "@presentation/stores/household";

const resolutionConfig = {
  month: {
    fetchFn: getMonthlyConsumption,
    add: addMonths,
    sub: subMonths,
    startOf: startOfMonth,
    endOf: endOfMonth,
  },
  week: {
    fetchFn: getWeeklyConsumption,
    add: addWeeks,
    sub: subWeeks,
    startOf: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    endOf: (date: Date) => endOfWeek(date, { weekStartsOn: 1 }),
  },
  day: {
    fetchFn: getDailyConsumption,
    add: addDays,
    sub: subDays,
    startOf: startOfDay,
    endOf: endOfDay,
  },
  hour: {
    fetchFn: getHourlyConsumption,
    add: addHours,
    sub: subHours,
    startOf: startOfHour,
    endOf: endOfHour,
  },
};

export function useConsumption() {
  const { selectedHouseholdId } = useHouseholdStore();
  const [resolution, setResolution] = useState<ConsumptionGranularity>("month");
  const [fetchTimeWindow, setFetchTimeWindow] = useState<TimeWindow>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<TimeWindow | null>(null);
  const [consumption, setConsumption] = useState<Consumption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorKey | undefined>(undefined);
  const latestFetchId = useRef(0);

  const intervals = 4;
  const config = resolutionConfig[resolution];

  const fetchData = useCallback(async () => {
    if (!selectedHouseholdId) {
      setConsumption([]);
      setSelectedTimeWindow(null);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    const fetchId = ++latestFetchId.current;

    setIsLoading(true);
    setError(undefined);

    const result = await config.fetchFn(
      selectedHouseholdId,
      fetchTimeWindow.startDate,
      fetchTimeWindow.endDate
    );

    if (fetchId !== latestFetchId.current) return;

    if (!result.success) {
      setError(result.error);
      setConsumption([]);
      setSelectedTimeWindow(null);
    } else {
      setConsumption(result.data);
      if (result.data.length > 0) {
        const last = result.data[result.data.length - 1];
        setSelectedTimeWindow({
          startDate: new Date(last.startDate),
          endDate: new Date(last.endDate),
        });
      } else {
        setSelectedTimeWindow(null);
      }
    }

    setIsLoading(false);
  }, [selectedHouseholdId, fetchTimeWindow, config]);

  useEffect(() => {
    const now = new Date();
    const start = config.sub(now, intervals - 1);
    const alignedStart =
      resolution === "hour" ? config.startOf(start) : startOfDay(config.startOf(start));

    setFetchTimeWindow({ startDate: alignedStart, endDate: now });
    setSelectedTimeWindow(null);
  }, [resolution, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const canMoveTimeWindowForward = useCallback(() => {
    return fetchTimeWindow.endDate < config.sub(new Date(), 1);
  }, [fetchTimeWindow, config]);

  const moveTimeWindow = useCallback(
    (direction: "back" | "forward") => {
      if (direction === "forward" && !canMoveTimeWindowForward()) return;

      const shift = direction === "back" ? -intervals : intervals;
      const rawStart = config.add(fetchTimeWindow.startDate, shift);
      const rawEnd = config.add(fetchTimeWindow.endDate, shift);

      const newEnd = direction === "forward" ? min([rawEnd, new Date()]) : config.endOf(rawEnd);

      const newStart =
        resolution === "hour" ? config.startOf(rawStart) : startOfDay(config.startOf(rawStart));

      setFetchTimeWindow({ startDate: newStart, endDate: newEnd });
    },
    [fetchTimeWindow, config, canMoveTimeWindowForward, resolution]
  );

  return {
    resolution,
    setResolution,
    selectedTimeWindow,
    setSelectedTimeWindow,
    consumption,
    isLoading,
    error,
    moveTimeWindow,
    canMoveTimeWindowForward,
  } as const;
}

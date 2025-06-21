import { useState, useEffect, useCallback } from "react";

import { skipToken } from "@tanstack/react-query";
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

import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { Granularity, TimeWindow } from "@domain/entities/consumption";
import { ErrorKey } from "@domain/entities/errors";

const granularityConfig = {
  month: {
    query: trpc.consumption.getMonthlyConsumption,
    add: addMonths,
    sub: subMonths,
    startOf: startOfMonth,
    endOf: endOfMonth,
  },
  week: {
    query: trpc.consumption.getWeeklyConsumption,
    add: addWeeks,
    sub: subWeeks,
    startOf: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    endOf: (date: Date) => endOfWeek(date, { weekStartsOn: 1 }),
  },
  day: {
    query: trpc.consumption.getDailyConsumption,
    add: addDays,
    sub: subDays,
    startOf: startOfDay,
    endOf: endOfDay,
  },
  hour: {
    query: trpc.consumption.getHourlyConsumption,
    add: addHours,
    sub: subHours,
    startOf: startOfHour,
    endOf: endOfHour,
  },
};

export function useConsumption() {
  const { selectedHouseholdId } = useHouseholdStore();
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [fetchTimeWindow, setFetchTimeWindow] = useState<TimeWindow | undefined>(undefined);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<TimeWindow | undefined>(undefined);

  const intervals = 4;
  const currentGranularityConfig = granularityConfig[granularity];

  useEffect(() => {
    const now = new Date();
    const start = currentGranularityConfig.sub(now, intervals - 1);
    const alignedStart =
      granularity === "hour"
        ? currentGranularityConfig.startOf(start)
        : startOfDay(currentGranularityConfig.startOf(start));
    setFetchTimeWindow({ startDate: alignedStart, endDate: now });
    setSelectedTimeWindow(undefined);
  }, [granularity, currentGranularityConfig, intervals]);

  const inputsReady =
    !!selectedHouseholdId &&
    !!fetchTimeWindow &&
    !!fetchTimeWindow.startDate &&
    !!fetchTimeWindow.endDate;

  const queryInput = inputsReady
    ? {
        householdId: selectedHouseholdId,
        startDate: fetchTimeWindow.startDate,
        endDate: fetchTimeWindow.endDate,
      }
    : skipToken;

  const {
    data: consumptionData,
    isLoading,
    error,
    isError,
  } = currentGranularityConfig.query.useQuery(queryInput, {
    enabled: inputsReady,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (consumptionData && consumptionData.length > 0) {
      const lastEntry = consumptionData[consumptionData.length - 1];
      if (lastEntry && lastEntry.startDate && lastEntry.endDate) {
        setSelectedTimeWindow({
          startDate: new Date(lastEntry.startDate),
          endDate: new Date(lastEntry.endDate),
        });
      } else {
        setSelectedTimeWindow(undefined);
      }
    } else {
      setSelectedTimeWindow(undefined);
    }
  }, [consumptionData]);

  const canMoveTimeWindowForward = useCallback(() => {
    if (!fetchTimeWindow?.endDate) return false;
    return fetchTimeWindow.endDate < currentGranularityConfig.sub(new Date(), 1);
  }, [fetchTimeWindow?.endDate, currentGranularityConfig]);

  const moveTimeWindow = useCallback(
    (direction: "back" | "forward") => {
      if (!fetchTimeWindow?.startDate || !fetchTimeWindow?.endDate) return;
      if (direction === "forward" && !canMoveTimeWindowForward()) return;

      const shift = direction === "back" ? -intervals : intervals;
      const rawStart = currentGranularityConfig.add(fetchTimeWindow.startDate, shift);
      const rawEnd = currentGranularityConfig.add(fetchTimeWindow.endDate, shift);
      const newEnd =
        direction === "forward"
          ? min([rawEnd, new Date()])
          : currentGranularityConfig.endOf(rawEnd);
      const newStart =
        granularity === "hour"
          ? currentGranularityConfig.startOf(rawStart)
          : startOfDay(currentGranularityConfig.startOf(rawStart));
      setFetchTimeWindow({ startDate: newStart, endDate: newEnd });
    },
    [fetchTimeWindow, currentGranularityConfig, canMoveTimeWindowForward, granularity, intervals]
  );

  let finalError: ErrorKey | undefined = undefined;
  if (isError && error) {
    const message = error.message;
    if (typeof message === "string") {
      finalError = message as ErrorKey;
    } else {
      finalError = "UNKNOWN_ERROR" as ErrorKey;
    }
  }

  return {
    granularity,
    setGranularity,
    selectedTimeWindow,
    setSelectedTimeWindow,
    consumption: consumptionData || [],
    isLoading,
    error: finalError,
    moveTimeWindow,
    canMoveTimeWindowForward,
  } as const;
}

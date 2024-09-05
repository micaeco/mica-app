import { useState, useCallback, useEffect } from "react";
import { TimeWindow, Resolution, Category } from "@/types";
import { getConsumption } from "@/lib/utils";
import { useEvents } from "./useEvents";

const RESOLUTION_TO_UNITS: Record<Resolution, number> = {
  day: 1,
  week: 7,
  month: 1,
};

export function useTimeWindow() {
  const [resolution, setResolution] = useState<Resolution>("month");
  const [timeWindow, setTimeWindow] =
    useState<TimeWindow>(getInitialTimeWindow);
  const [data, setData] = useState<any[]>([]);
  const { events } = useEvents();

  const count = resolution === "month" ? 8 : 6;

  const updateData = useCallback(() => {
    const { startDate, endDate } = getTimeWindowForResolution(resolution);
    setTimeWindow({ startDate, endDate });

    const newData = generateTimeWindows(
      count,
      startDate,
      endDate,
      resolution
    ).map((window) => ({
      timeWindow: window,
      consumption: getConsumption(events, window),
    }));

    setData(newData.reverse());
    console.log(newData);
  }, [resolution, events]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  return {
    timeWindow,
    setTimeWindow,
    resolution,
    setResolution,
    data,
  };
}

function getInitialTimeWindow(): TimeWindow {
  const end = setToEndOfDay(new Date());
  const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
  return { startDate: setToStartOfDay(start), endDate: end };
}

function getTimeWindowForResolution(resolution: Resolution): TimeWindow {
  const endDate = setToEndOfDay(new Date());
  let startDate: Date;

  switch (resolution) {
    case "day":
      startDate = setToStartOfDay(new Date(endDate));
      break;
    case "week":
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      startDate = setToStartOfDay(startDate);
      break;
    case "month":
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      startDate = setToStartOfDay(startDate);
      break;
  }

  return { startDate, endDate };
}

function generateTimeWindows(
  count: number,
  startDate: Date,
  endDate: Date,
  resolution: Resolution
) {
  const windows: TimeWindow[] = [];
  let currentEnd = new Date(endDate);
  let currentStart = new Date(startDate);

  for (let i = 0; i < count; i++) {
    windows.push({
      startDate: new Date(currentStart),
      endDate: new Date(currentEnd),
    });

    if (resolution === "month") {
      currentEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth(), 0);
      currentEnd = setToEndOfDay(currentEnd);
      currentStart = new Date(
        currentStart.getFullYear(),
        currentStart.getMonth() - 1,
        1
      );
    } else {
      currentEnd = setToEndOfDay(new Date(currentStart));
      currentStart.setDate(
        currentStart.getDate() - RESOLUTION_TO_UNITS[resolution]
      );
    }
    currentStart = setToStartOfDay(currentStart);
  }

  return windows;
}

function setToStartOfDay(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  return date;
}

function setToEndOfDay(date: Date): Date {
  date.setHours(23, 59, 59, 999);
  return date;
}

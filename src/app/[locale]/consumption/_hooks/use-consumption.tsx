"use client";

import { useCallback, useEffect, useState } from "react";

import { Category } from "@domain/entities/category";
import { ErrorKey } from "@domain/entities/error";
import { Consumption, ConsumptionGranularity } from "@domain/entities/consumption";
import { Event } from "@domain/entities/event";
import { getEvents } from "@presentation/lib/actions";
import { TimeWindow } from "@presentation/lib/types";
import { useHouseholdStore } from "@presentation/stores/household";
import {
  getDailyConsumption,
  getHourlyConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
} from "@app/[locale]/consumption/actions";

export function useConsumption() {
  const [resolution, setResolution] = useState<ConsumptionGranularity>("month");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<TimeWindow>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedCategories, setSelectedCategories] = useState<Category[] | undefined>(undefined);
  const [consumption, setConsumption] = useState<Consumption[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorKey | undefined>(undefined);

  const { selectedHouseholdId } = useHouseholdStore();

  const timeWindowLength = 4;

  const fetchConsumption = useCallback(
    async (startDate: Date, endDate: Date) => {
      setIsLoading(true);

      const consumptionResult =
        resolution === "month"
          ? await getMonthlyConsumption(selectedHouseholdId, startDate, endDate)
          : resolution === "week"
            ? await getWeeklyConsumption(selectedHouseholdId, startDate, endDate)
            : resolution === "day"
              ? await getDailyConsumption(selectedHouseholdId, startDate, endDate)
              : await getHourlyConsumption(selectedHouseholdId, startDate, endDate);

      if (consumptionResult.success) {
        setConsumption(consumptionResult.data);
        if (consumptionResult.data.length > 0) {
          const lastItem = consumptionResult.data[consumptionResult.data.length - 1];

          setSelectedTimeWindow({
            startDate: lastItem.startDate,
            endDate: lastItem.endDate,
          });
        }
      } else {
        setError(consumptionResult.error);
      }

      setIsLoading(false);
    },
    [resolution, selectedHouseholdId]
  );

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsResult = await getEvents(
        selectedHouseholdId,
        selectedTimeWindow.startDate,
        selectedTimeWindow.endDate
      );

      if (eventsResult.success) {
        setEvents(eventsResult.data);
      } else {
        setError(eventsResult.error);
      }
    };

    fetchEvents();
  }, [selectedHouseholdId, selectedTimeWindow]);

  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();

    switch (resolution) {
      case "month":
        startDate.setMonth(startDate.getMonth() - (timeWindowLength - 1));
        break;
      case "week":
        startDate.setDate(startDate.getDate() - (timeWindowLength - 1) * 7);
        break;
      case "day":
        startDate.setDate(startDate.getDate() - (timeWindowLength - 1));
        break;
      case "hour":
        startDate.setTime(startDate.getTime() - (timeWindowLength - 1) * 60 * 60 * 1000);
        break;
    }

    setTimeWindow({ startDate, endDate });
    fetchConsumption(startDate, endDate);
  }, [resolution, selectedHouseholdId, fetchConsumption]);

  function canMoveTimeWindowForward() {
    if (consumption.length === 0) {
      return false;
    }

    const lastUpdatedDate = new Date(consumption[consumption.length - 1].endDate);

    return lastUpdatedDate < new Date();
  }

  function moveTimeWindow(direction: "back" | "forward") {
    if (direction === "forward" && !canMoveTimeWindowForward()) {
      return;
    }

    let startDate: Date, endDate: Date;

    switch (resolution) {
      case "month":
        if (direction === "back") {
          const referenceDate = new Date(timeWindow.startDate);
          endDate = new Date(referenceDate);
          endDate.setMonth(endDate.getMonth() - 1);
          startDate = new Date(referenceDate);
          startDate.setMonth(startDate.getMonth() - timeWindowLength);
        } else {
          const referenceDate = new Date(timeWindow.endDate);
          startDate = new Date(referenceDate);
          startDate.setMonth(startDate.getMonth() + 1);
          endDate = new Date(referenceDate);
          endDate.setMonth(endDate.getMonth() + timeWindowLength);
          const now = new Date();
          if (endDate > now) {
            endDate = now;
          }
        }
        break;
      case "week":
        if (direction === "back") {
          const referenceDate = new Date(timeWindow.startDate);
          endDate = new Date(referenceDate);
          endDate.setDate(endDate.getDate() - 1 * 7);
          startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() - 7 * timeWindowLength);
        } else {
          const referenceDate = new Date(timeWindow.endDate);
          startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() + 1 * 7);
          endDate = new Date(referenceDate);
          endDate.setDate(endDate.getDate() + timeWindowLength * 7);
          const now = new Date();
          if (endDate > now) {
            endDate = now;
          }
        }
        break;
      case "day":
        if (direction === "back") {
          const referenceDate = new Date(timeWindow.startDate);
          endDate = new Date(referenceDate);
          endDate.setDate(endDate.getDate() - 1);
          startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() - timeWindowLength);
        } else {
          const referenceDate = new Date(timeWindow.endDate);
          startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() + 1);
          endDate = new Date(referenceDate);
          endDate.setDate(endDate.getDate() + timeWindowLength);
          const now = new Date();
          if (endDate > now) {
            endDate = now;
          }
        }
        break;
      case "hour":
        if (direction === "back") {
          const referenceDate = new Date(timeWindow.startDate);
          endDate = new Date(referenceDate.getTime() - 1 * 60 * 60 * 1000);
          startDate = new Date(referenceDate.getTime() - timeWindowLength * 60 * 60 * 1000);
        } else {
          const referenceDate = new Date(timeWindow.endDate);
          startDate = new Date(referenceDate.getTime() + 1 * 60 * 60 * 1000);
          endDate = new Date(referenceDate.getTime() + timeWindowLength * 60 * 60 * 1000);
          const now = new Date();
          if (endDate > now) {
            endDate = now;
          }
        }
        break;
    }

    setTimeWindow({ startDate, endDate });
    fetchConsumption(startDate, endDate);
  }

  return {
    timeWindow,
    setTimeWindow,
    moveTimeWindow,
    canMoveTimeWindowForward,
    selectedTimeWindow,
    setSelectedTimeWindow,
    resolution,
    setResolution,
    selectedCategories,
    setSelectedCategories,
    consumption,
    events,
    isLoading,
    error,
  } as const;
}

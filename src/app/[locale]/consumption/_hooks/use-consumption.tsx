"use client";

import { useCallback, useEffect, useState } from "react";

import { Consumption } from "@core/entities/consumption";
import { Event } from "@core/entities/event";
import { ConsumptionResolution, TimeWindow } from "@lib/types";
import { useHouseholdStore } from "@stores/household";
import {
  getDailyConsumption,
  getEvents,
  getHourlyConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
} from "@app/[locale]/consumption/actions";
import { Category } from "@core/entities/category";
import { ErrorKey } from "@core/entities/error";

export function useConsumption() {
  const [resolution, setResolution] = useState<ConsumptionResolution>("month");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<TimeWindow>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [consumption, setConsumption] = useState<Consumption[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorKey | undefined>(undefined);
  const { selectedHouseholdSensorId } = useHouseholdStore();

  const timeWindowLength = 4;

  const fetchConsumption = useCallback(
    async (startDate: Date, endDate: Date) => {
      setIsLoading(true);

      const consumptionResult =
        resolution === "month"
          ? await getMonthlyConsumption(selectedHouseholdSensorId, startDate, endDate)
          : resolution === "week"
            ? await getWeeklyConsumption(selectedHouseholdSensorId, startDate, endDate)
            : resolution === "day"
              ? await getDailyConsumption(selectedHouseholdSensorId, startDate, endDate)
              : await getHourlyConsumption(selectedHouseholdSensorId, startDate, endDate);

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
    [resolution, selectedHouseholdSensorId]
  );

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsResult = await getEvents(
        selectedHouseholdSensorId,
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
  }, [selectedHouseholdSensorId, selectedTimeWindow]);

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
  }, [resolution, selectedHouseholdSensorId, fetchConsumption]);

  function canMoveTimeWindowForward() {
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
    category,
    setCategory,
    consumption,
    events,
    isLoading,
    error,
  } as const;
}

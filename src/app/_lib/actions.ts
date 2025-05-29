"use server";

import { createContainer } from "@di/container";
import { ErrorKey } from "@domain/entities/errors";
import { Event, EventsForDay } from "@domain/entities/event";
import { Household } from "@domain/entities/household";

async function findAllHouseholds(): Promise<Household[]> {
  const container = createContainer();
  const householdRepo = container.householdRepo;
  return householdRepo.findAll();
}

async function updateHousehold(
  householdId: string,
  household: Partial<Omit<Household, "id">>
): Promise<void> {
  const container = createContainer();
  const householdRepo = container.householdRepo;
  householdRepo.update(householdId, household);
}

async function getEvents(
  sensorId: string,
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Event[] } | { success: false; error: ErrorKey }> {
  try {
    const container = createContainer();
    const eventRepo = container.eventRepo;
    const data = await eventRepo.getEvents(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getEvents]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getPaginatedEventsGroupedByDay(
  sensorId: string,
  offset: number,
  numberOfEvents: number
): Promise<{ success: true; data: EventsForDay[] } | { success: false; error: ErrorKey }> {
  try {
    const container = createContainer();
    const eventRepo = container.eventRepo;
    const events = await eventRepo.getPaginatedEvents(sensorId, offset, numberOfEvents);

    events.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    const dayMap: Record<string, EventsForDay> = {};

    events.forEach((event) => {
      const date = new Date(event.startDate);
      date.setHours(0, 0, 0, 0);

      const dateKey = date.getTime().toString();

      if (!dayMap[dateKey]) {
        dayMap[dateKey] = {
          date,
          events: [],
          totalConsumption: 0,
        };
      }

      dayMap[dateKey].events.push(event);

      if (event.consumptionInLiters) {
        dayMap[dateKey].totalConsumption += event.consumptionInLiters;
      }
    });

    const groupedData = Object.values(dayMap).sort((a, b) => b.date.getTime() - a.date.getTime());

    return { success: true, data: groupedData };
  } catch (error) {
    console.error("[getPaginatedEvents]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

export { getEvents, getPaginatedEventsGroupedByDay, findAllHouseholds, updateHousehold };

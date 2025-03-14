"use server";

import { ErrorKey } from "@core/entities/error";
import { Sensor } from "@core/entities/sensor";
import { Event } from "@core/entities/event";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";

async function getLeakEvents(
  sensorId: Sensor["id"]
): Promise<{ success: true; data: Event[] } | { success: false; error: ErrorKey }> {
  const eventRepo = new MockEventRepository();

  try {
    const events = await eventRepo.getLeakEvents(sensorId);
    return { success: true, data: events };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getUnknownEvents(
  sensorId: Sensor["id"]
): Promise<{ success: true; data: Event[] } | { success: false; error: ErrorKey }> {
  const eventRepo = new MockEventRepository();

  try {
    const events = await eventRepo.getUnknownEvents(sensorId);
    return { success: true, data: events };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

export { getLeakEvents, getUnknownEvents };

"use server";

import { ErrorKey } from "@domain/entities/errors";
import { Event } from "@domain/entities/event";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";

async function getLeakEvents(
  sensorId: string
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
  sensorId: string
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

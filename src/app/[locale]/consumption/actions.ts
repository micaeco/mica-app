"use server";

import { ErrorKey } from "@core/entities/error";
import { Event } from "@core/entities/event";
import { Sensor } from "@core/entities/sensor";
import { Consumption } from "@core/entities/consumption";
import { MockConsumptionRepository } from "@infrastructure/repositories/consumption.mock";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";

async function getConsumption(
  sensorId: Sensor["id"],
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Consumption } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();
    const data = await consumptionRepo.getConsumption(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getConsumption]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getMonthlyConsumption(
  sensorId: Sensor["id"],
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Consumption[] } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();
    const data = await consumptionRepo.getMonthlyConsumption(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getMonthlyConsumption]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getWeeklyConsumption(
  sensorId: Sensor["id"],
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Consumption[] } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();
    const data = await consumptionRepo.getWeeklyConsumption(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getWeeklyConsumption]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getDailyConsumption(
  sensorId: Sensor["id"],
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Consumption[] } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();
    const data = await consumptionRepo.getDailyConsumption(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getDailyConsumption]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getHourlyConsumption(
  sensorId: Sensor["id"],
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Consumption[] } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();
    const data = await consumptionRepo.getHourlyConsumption(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getHourlyConsumption]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getEvents(
  sensorId: Sensor["id"],
  startDate: Date,
  endDate: Date
): Promise<{ success: true; data: Event[] } | { success: false; error: ErrorKey }> {
  try {
    const eventRepo = new MockEventRepository();
    const data = await eventRepo.getEvents(sensorId, startDate, endDate);
    return { success: true, data };
  } catch (error) {
    console.error("[getEvents]", error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

export {
  getConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
  getDailyConsumption,
  getHourlyConsumption,
  getEvents,
};

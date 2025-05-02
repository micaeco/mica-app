"use server";

import { ErrorKey } from "@domain/entities/error";
import { Consumption } from "@domain/entities/consumption";
import { MockConsumptionRepository } from "@infra/repositories/consumption.mock";

async function getConsumption(
  sensorId: string,
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
  sensorId: string,
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
  sensorId: string,
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
  sensorId: string,
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
  sensorId: string,
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

export {
  getConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
  getDailyConsumption,
  getHourlyConsumption,
};

import "server-only";

import { Consumption } from "@domain/entities/consumption";

export interface ConsumptionRepository {
  getConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption>;

  getMonthlyConsumption(
    householdId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]>;

  getWeeklyConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption[]>;

  getDailyConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption[]>;

  getHourlyConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption[]>;

  getCurrentMonthConsumption(householdId: string): Promise<Consumption>;

  getCurrentDayConsumption(householdId: string): Promise<Consumption>;
}

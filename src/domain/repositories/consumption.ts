import { Consumption, Granularity } from "@domain/entities/consumption";

export interface ConsumptionRepository {
  getConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption>;

  getConsumptionByGranularity(
    householdId: string,
    startDate: Date,
    endDate: Date,
    granularity: Granularity
  ): Promise<Consumption[]>;

  getCurrentMonthConsumption(householdId: string): Promise<Consumption>;

  getCurrentDayConsumption(householdId: string): Promise<Consumption>;
}

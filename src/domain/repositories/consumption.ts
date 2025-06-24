import { Consumption, Granularity } from "@domain/entities/consumption";
export interface ConsumptionRepository {
  getConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption>;

  getConsumptionByGranularity(
    householdId: string,
    granularity: Granularity,
    startDate?: Date,
    endDate?: Date,
    order?: "asc" | "desc",
    cursor?: { timestamp: Date },
    limit?: number
  ): Promise<Consumption[]>;

  getCurrentMonthConsumption(householdId: string): Promise<Consumption>;

  getCurrentDayConsumption(householdId: string): Promise<Consumption>;
}

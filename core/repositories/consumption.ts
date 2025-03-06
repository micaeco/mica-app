import "server-only";

import { Consumption } from "@core/entities/consumption";
import { Sensor } from "@core/entities/sensor";
export interface ConsumptionRepository {
  getConsumption(sensorId: Sensor["id"], startDate: Date, endDate: Date): Promise<Consumption>;

  getMonthlyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]>;

  getWeeklyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]>;

  getDailyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]>;

  getHourlyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]>;
}

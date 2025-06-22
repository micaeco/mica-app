import { Sensor } from "@domain/entities/sensor";

export interface SensorRepository {
  exists(sensorId: string): Promise<boolean>;
  findById(sensorId: string): Promise<Sensor | null>;
  assignHouseholdToSensor(sensorId: string, householdId: string): Promise<Sensor | null>;
  unassignHouseholdFromSensor(sensorId: string): Promise<Sensor | null>;
}

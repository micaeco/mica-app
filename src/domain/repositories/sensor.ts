import { Sensor } from "@domain/entities/sensor";

export interface SensorRepository {
  findById(sensorId: string): Sensor | null;
}

import { RecirculatorStatus, TemperatureReading } from "@domain/entities/recirculator";

export interface RecirculatorService {
  getState(deviceId: string): Promise<"ON" | "OFF">;
  turnOn(deviceId: string): Promise<void>;
  turnOff(deviceId: string): Promise<void>;
  setMaxTemperature(deviceId: string, maxTemperature: number): Promise<void>;
  getLastTemperature(deviceId: string): Promise<TemperatureReading | null>;
  getStatus(deviceId: string): Promise<RecirculatorStatus>;
}

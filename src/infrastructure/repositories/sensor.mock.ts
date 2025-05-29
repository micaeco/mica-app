import { Sensor } from "@domain/entities/sensor";
import { SensorRepository } from "@domain/repositories/sensor";

const mockSensors: Sensor[] = [
  {
    id: "123456789123",
  },
];

export class MockSensorRepository implements SensorRepository {
  findById(sensorId: string): Sensor | null {
    return mockSensors.find((sensor) => sensor.id === sensorId) || null;
  }
}

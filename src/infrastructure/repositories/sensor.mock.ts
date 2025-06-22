import { Sensor } from "@domain/entities/sensor";
import { SensorRepository } from "@domain/repositories/sensor";

const mockSensors: Sensor[] = [
  {
    id: "123456789123",
    householdId: undefined,
    status: "online",
    batteryLevel: 85,
  },
];

export class MockSensorRepository implements SensorRepository {
  async exists(sensorId: string): Promise<boolean> {
    return mockSensors.some((sensor) => sensor.id === sensorId);
  }

  async findById(sensorId: string): Promise<Sensor | null> {
    return mockSensors.find((sensor) => sensor.id === sensorId) || null;
  }

  async assignHouseholdToSensor(sensorId: string, householdId: string): Promise<Sensor | null> {
    const sensor = await this.findById(sensorId);
    if (sensor) {
      sensor.householdId = householdId;
      return sensor;
    }
    return null;
  }

  async unassignHouseholdFromSensor(sensorId: string): Promise<void> {
    const sensor = await this.findById(sensorId);
    if (sensor) {
      sensor.householdId = undefined;
    } else {
      throw new Error(`Sensor with ID ${sensorId} not found`);
    }
  }
}

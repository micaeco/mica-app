import axios from "axios";

import { Sensor } from "@domain/entities/sensor";
import { SensorRepository } from "@domain/repositories/sensor";
import { env } from "@env";

interface ApiSensorResponse {
  sensorId: string;
  status: string;
  batteryLevel: number;
}

export class ApiSensorRepository implements SensorRepository {
  async exists(sensorId: string): Promise<boolean> {
    try {
      const response = await axios.head(env.AWS_API_GATEWAY_URL + "/sensors/" + sensorId, {
        headers: {
          Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
        },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async findById(sensorId: string): Promise<Sensor | null> {
    try {
      const response = await axios.get<ApiSensorResponse>(
        env.AWS_API_GATEWAY_URL + "/sensors/" + sensorId,
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
        }
      );
      return {
        id: response.data.sensorId,
        status: (response.data.status as "online" | "offline") || "offline",
        batteryLevel: response.data.batteryLevel,
      };
    } catch {
      throw new Error("Failed to fetch sensor");
    }
  }

  async assignHouseholdToSensor(sensorId: string, householdId: string): Promise<Sensor | null> {
    try {
      const response = await axios.patch(
        env.AWS_API_GATEWAY_URL + "/sensors/" + sensorId,
        {},
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            householdId: householdId,
          },
        }
      );
      return response.data;
    } catch {
      throw new Error("Failed to assign household to sensor");
    }
  }

  async unassignHouseholdFromSensor(sensorId: string, householdId: string): Promise<void> {
    try {
      await axios.patch(
        env.AWS_API_GATEWAY_URL + "/sensors/" + sensorId,
        {},
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            householdId: householdId,
            unassignHousehold: true,
          },
        }
      );
    } catch {
      throw new Error("Failed to unassign household from sensor");
    }
  }
}

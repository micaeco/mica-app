import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";

import { TemperatureReading } from "@domain/entities/recirculator";
import { RecirculatorService } from "@domain/services/recirculator";
import { env } from "@env";

const iotClient = new IoTDataPlaneClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${env.AWS_IOT_ENDPOINT}`,
});

export class IoTRecirculatorService implements RecirculatorService {
  private getTopicPath(deviceId: string, type: "command" | "telemetry", suffix: string): string {
    return `mica/dev/${type}/recirculator/${deviceId}/${suffix}`;
  }

  private async publish(topic: string, payload: object | string): Promise<void> {
    const command = new PublishCommand({
      topic,
      payload: Buffer.from(typeof payload === "string" ? payload : JSON.stringify(payload)),
      qos: 1,
    });

    await iotClient.send(command);
  }

  async getState(deviceId: string): Promise<"ON" | "OFF"> {
    const topic = this.getTopicPath(deviceId, "telemetry", "power-state");
    try {
      const command = new GetRetainedMessageCommand({ topic });
      const response = await iotClient.send(command);

      if (!response.payload) {
        return "OFF";
      }

      const data = JSON.parse(Buffer.from(response.payload).toString());
      const state = data.state;

      if (state === "ON" || state === "OFF") {
        return state;
      } else {
        return "OFF";
      }
    } catch {
      return "OFF";
    }
  }

  async turnOn(deviceId: string): Promise<void> {
    const topic = this.getTopicPath(deviceId, "command", "power-state");
    await this.publish(topic, "ON");
  }

  async turnOff(deviceId: string): Promise<void> {
    const topic = this.getTopicPath(deviceId, "command", "power-state");
    await this.publish(topic, "OFF");
  }

  async setMaxTemperature(deviceId: string, maxTemperature: number): Promise<void> {
    const topic = this.getTopicPath(deviceId, "command", "max-temperature");
    await this.publish(topic, String(maxTemperature));
  }

  async getLastTemperature(deviceId: string): Promise<TemperatureReading | null> {
    const topic = this.getTopicPath(deviceId, "telemetry", "temperature");

    try {
      const command = new GetRetainedMessageCommand({ topic });
      const response = await iotClient.send(command);

      if (!response.payload) {
        return null;
      }

      const data = JSON.parse(Buffer.from(response.payload).toString());

      const result = TemperatureReading.safeParse({
        temperature: data.temperature,
        timestamp: data.uptime ?? data.timestamp ?? new Date().toISOString(),
      });

      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }

  async getStatus(
    deviceId: string
  ): Promise<import("@domain/entities/recirculator").RecirculatorStatus> {
    const [state, temperatureReading] = await Promise.all([
      this.getState(deviceId),
      this.getLastTemperature(deviceId),
    ]);

    return {
      state,
      temperature: temperatureReading?.temperature ?? null,
      timestamp: temperatureReading?.timestamp ?? null,
    };
  }
}

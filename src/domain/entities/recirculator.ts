import { z } from "zod";

export const PowerState = z.enum(["ON", "OFF"]);
export type PowerState = z.infer<typeof PowerState>;

export const MIN_SAFE_TEMPERATURE = 20;
export const MAX_SAFE_TEMPERATURE = 35;
export const DEFAULT_MAX_TEMPERATURE = 35;

export const setMaxTemperatureInput = z.object({
  deviceId: z.string().min(1),
  maxTemperature: z.number().min(MIN_SAFE_TEMPERATURE).max(MAX_SAFE_TEMPERATURE),
});

export const deviceIdInput = z.object({
  deviceId: z.string().min(1),
});

export const TemperatureReading = z.object({
  temperature: z.number().min(0).max(100),
  timestamp: z.union([z.string(), z.number()]),
});

export type TemperatureReading = z.infer<typeof TemperatureReading>;

export const RecirculatorStatus = z.object({
  state: PowerState,
  temperature: z.number().nullable(),
  timestamp: z.union([z.string(), z.number()]).nullable(),
});

export type RecirculatorStatus = z.infer<typeof RecirculatorStatus>;

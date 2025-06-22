import { z } from "zod";

export const sensorIdSchema = z.preprocess(
  (val) => String(val).replace(/[^0-9a-fA-F]/g, ""),

  z.string().regex(/^[0-9a-fA-F]{12}$/)
);

export const Sensor = z.object({
  id: sensorIdSchema,
  householdId: z.string().optional(),
  status: z.enum(["online", "offline"]),
  batteryLevel: z.number().min(0).max(100).optional(),
});

export type Sensor = z.infer<typeof Sensor>;

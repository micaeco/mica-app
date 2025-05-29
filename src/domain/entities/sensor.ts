import { z } from "zod";

export const sensorIdSchema = z.string().regex(/^[0-9a-fA-F]{12}$/);

export const Sensor = z.object({
  id: sensorIdSchema,
});

export type Sensor = z.infer<typeof Sensor>;

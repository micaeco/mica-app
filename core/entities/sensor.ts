import { z } from "zod";

export const Sensor = z.object({
  id: z.string(),
  battery: z.number().min(0).max(100),
  state: z.enum(["active", "inactive"]),
});

export type Sensor = z.infer<typeof Sensor>;

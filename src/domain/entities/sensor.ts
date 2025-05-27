import { z } from "zod";

export const Sensor = z.object({
  id: z.string(),
  mac: z.string().regex(/^[0-9a-fA-F]{12}$/),
});

export type Sensor = z.infer<typeof Sensor>;

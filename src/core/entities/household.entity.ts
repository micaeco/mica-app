import { z } from "zod";

export const Household = z.object({
  id: z.string(),
  name: z.string(),
  sensorId: z.string(),
});

export type Household = z.infer<typeof Household>;

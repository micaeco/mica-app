import { z } from "zod";

import { Sensor } from "@core/entities/sensor";

export const Household = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  surface: z.number(),
  residents: z.number().positive(),

  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),

  sensor: Sensor,
});

export type Household = z.infer<typeof Household>;

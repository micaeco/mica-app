import { z } from "zod";

import { sensorIdSchema } from "@domain/entities/sensor";

export const Household = z.object({
  id: z.string(),
  sensorId: sensorIdSchema,

  name: z.string().min(1),
  icon: z.string().optional(),
  residents: z.number().min(1),

  street1: z.string().min(1).optional(),
  street2: z.string().optional(),
  city: z.string().min(1).optional(),
  zip: z
    .string()
    .regex(/^\d{5}$/)
    .optional(),
  country: z.string().min(1).optional(),
});

export const createHousehold = Household.omit({ id: true });

export type Household = z.infer<typeof Household>;

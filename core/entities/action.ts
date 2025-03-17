import { z } from "zod";

const Action = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  event: z.string(),
});

export type Action = z.infer<typeof Action>;

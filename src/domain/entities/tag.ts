import { z } from "zod";

import { Category } from "@domain/entities/category";

export const Tag = z.object({
  id: z.number(),
  category: Category,
  householdId: z.string(),
  name: z.string(),
});

export type Tag = z.infer<typeof Tag>;

import { z } from "zod";

import { Category } from "@domain/entities/category";

export const Tag = z.object({
  name: z.string(),
  category: Category,
  householdId: z.string(),
});

export type Tag = z.infer<typeof Tag>;

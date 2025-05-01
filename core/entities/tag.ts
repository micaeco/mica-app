import { z } from "zod";

import { Category } from "@core/entities/category";

export const Tag = z.object({
  name: z.string(),
  category: Category,
  householdId: z.string(),
});

export type Tag = z.infer<typeof Tag>;

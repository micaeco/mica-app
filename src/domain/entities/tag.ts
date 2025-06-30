import { z } from "zod";

import { Category } from "@domain/entities/category";

export const Tag = z.object({
  id: z.number(),
  category: Category,
  householdId: z.string(),
  name: z.string().min(1),
});

export type Tag = z.infer<typeof Tag>;

export const createTag = Tag.omit({
  id: true,
});

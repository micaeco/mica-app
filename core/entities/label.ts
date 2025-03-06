import { z } from "zod";

import { CategoryType } from "@core/entities/category";

export const Label = z.object({
  categoryType: CategoryType,
  householdId: z.string(),

  name: z.string(),
});

export type Label = z.infer<typeof Label>;

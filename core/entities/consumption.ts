import { z } from "zod";

import { CategoryType } from "@core/entities/category";

export const CategoryBreakdown = z.object({
  type: CategoryType,
  consumptionInLiters: z.number(),
});

export type CategoryBreakdown = z.infer<typeof CategoryBreakdown>;

export const Consumption = z.object({
  startDate: z.date(),
  endDate: z.date(),
  consumptionInLiters: z.number(),
  categoryBreakdown: z.array(CategoryBreakdown),
});

export type Consumption = z.infer<typeof Consumption>;

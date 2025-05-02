import { z } from "zod";

import { Category } from "@domain/entities/category";

export const CategoryBreakdown = z.object({
  category: Category,
  consumptionInLiters: z.number(),
});

export type CategoryBreakdown = z.infer<typeof CategoryBreakdown>;

export const Consumption = z.object({
  startDate: z.date(),
  endDate: z.date(),
  consumptionInLiters: z.number().positive(),
  consumptionInLitersPerDayPerPerson: z.number().positive(),
  consumptionPercentDeviationFromBaseline: z.number().min(-100),
  categoryBreakdown: z.array(CategoryBreakdown),
});

export type Consumption = z.infer<typeof Consumption>;

export const ConsumptionGranularity = z.enum(["day", "week", "month", "hour"]);

export type ConsumptionGranularity = z.infer<typeof ConsumptionGranularity>;

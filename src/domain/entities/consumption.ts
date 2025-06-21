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

export const Granularity = z.enum(["day", "week", "month", "hour"]);

export type Granularity = z.infer<typeof Granularity>;

export const TimeWindow = z.object({
  startDate: z.date(),
  endDate: z.date(),
  consumption: z.number().positive().optional(),
});

export type TimeWindow = z.infer<typeof TimeWindow>;

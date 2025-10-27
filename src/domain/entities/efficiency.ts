import { Clock, Droplet, LucideIcon, User, Waves } from "lucide-react";
import { z } from "zod";

import { Category } from "@domain/entities/category";

export const efficiencyCategories = [
  "shower",
  "toilet",
  "washer",
  "dishwasher",
] as const satisfies readonly Category[];

export const KPITypes = [
  "usesPerPersonDaily",
  "consumptionPerCycle",
  "tankVolume",
  "timePerUse",
  "flowRate",
] as const;

export const KPIToUnit: Partial<Record<(typeof KPITypes)[number], string>> = {
  consumptionPerCycle: "L",
  tankVolume: "L",
  timePerUse: "min",
  flowRate: "L/min",
};

export const KPIToIcon: Record<(typeof KPITypes)[number], LucideIcon> = {
  usesPerPersonDaily: User,
  consumptionPerCycle: Droplet,
  tankVolume: Droplet,
  timePerUse: Clock,
  flowRate: Waves,
};

export const KPIToThreshold: Record<(typeof KPITypes)[number], Thresholds> = {
  usesPerPersonDaily: [7, 5, 3],
  consumptionPerCycle: [45, 40, 35],
  tankVolume: [9, 8, 7],
  timePerUse: [5, 4, 3],
  flowRate: [8, 7, 6],
};

export type KPIType = (typeof KPITypes)[number];

export type KPI = {
  type: KPIType;
  value: number;
};

export const EfficiencyCategory = z.enum(efficiencyCategories);
export type EfficiencyCategory = z.infer<typeof EfficiencyCategory>;

export const Thresholds = z.tuple([z.number(), z.number(), z.number()]);
export type Thresholds = z.infer<typeof Thresholds>;

export const ConsumptionPerDayPerPersonBenchmark = z.object({
  value: z.number(),
  average: z.number(),
  target: z.number(),
});
export type ConsumptionPerDayPerPersonBenchmark = z.infer<
  typeof ConsumptionPerDayPerPersonBenchmark
>;

export const EfficiencyMetric = z.object({
  consumptionBenchmark: ConsumptionPerDayPerPersonBenchmark,
  thresholds: Thresholds,
  kpis: z.array(z.custom<KPI>()).optional(),
});
export type EfficiencyMetric = z.infer<typeof EfficiencyMetric>;

export const Recommendation = z.object({
  id: z.string(),
  description: z.object({
    en: z.string(),
    es: z.string(),
    ca: z.string(),
  }),
  category: EfficiencyCategory,
  percentatgeSavings: z.number(),
});
export type Recommendation = z.infer<typeof Recommendation>;

export const Efficiency = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  overall: EfficiencyMetric,
  byCategory: z.object(
    Object.fromEntries(
      efficiencyCategories.map((category) => [category, EfficiencyMetric])
    ) as Record<EfficiencyCategory, typeof EfficiencyMetric>
  ),
  recommendations: z.array(Recommendation),
});
export type Efficiency = z.infer<typeof Efficiency>;

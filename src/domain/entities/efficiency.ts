import { Clock, Droplet, LucideIcon, User, Waves } from "lucide-react";
import { z } from "zod";

import { Category } from "@domain/entities/category";

export const efficiencyCategories = [
  "shower",
  "toilet",
  "washer",
  "dishwasher",
] as const satisfies readonly Category[];

export const showerKPITypes = ["usesPerPersonDaily", "timePerUse", "flowRate"] as const;

export const toiletKPITypes = ["usesPerPersonDaily", "tankVolume"] as const;

export const washerKPITypes = ["usesPerPersonDaily", "consumptionPerCycle"] as const;

export const dishwasherKPITypes = ["usesPerPersonDaily", "consumptionPerCycle"] as const;

export const KPITypes = [
  "usesPerPersonDaily",
  "consumptionPerCycle",
  "tankVolume",
  "timePerUse",
  "flowRate",
] as const;

export type KPIType = (typeof KPITypes)[number];
export type ShowerKPIType = (typeof showerKPITypes)[number];
export type ToiletKPIType = (typeof toiletKPITypes)[number];
export type WasherKPIType = (typeof washerKPITypes)[number];
export type DishwasherKPIType = (typeof dishwasherKPITypes)[number];

export const KPIToUnit: Partial<Record<KPIType, string>> = {
  consumptionPerCycle: "L",
  tankVolume: "L",
  timePerUse: "min",
  flowRate: "L/min",
};

export const KPIToIcon: Record<KPIType, LucideIcon> = {
  usesPerPersonDaily: User,
  consumptionPerCycle: Droplet,
  tankVolume: Droplet,
  timePerUse: Clock,
  flowRate: Waves,
};

export const showerKPIThresholds: Record<ShowerKPIType, Thresholds> = {
  usesPerPersonDaily: [1, 1.5, 2],
  timePerUse: [5, 7, 10],
  flowRate: [6, 7.6, 9.5],
};

export const toiletKPIThresholds: Record<ToiletKPIType, Thresholds> = {
  usesPerPersonDaily: [5, 6, 8],
  tankVolume: [4.5, 6, 9],
};

export const washerKPIThresholds: Record<WasherKPIType, Thresholds> = {
  usesPerPersonDaily: [0.35, 0.5, 0.7],
  consumptionPerCycle: [40, 50, 70],
};

export const dishwasherKPIThresholds: Record<DishwasherKPIType, Thresholds> = {
  usesPerPersonDaily: [0.3, 0.4, 0.6],
  consumptionPerCycle: [10, 15, 20],
};

export type KPI = {
  type: KPIType;
  value: number;
};

export type ShowerKPI = {
  type: ShowerKPIType;
  value: number;
};

export type ToiletKPI = {
  type: ToiletKPIType;
  value: number;
};

export type WasherKPI = {
  type: WasherKPIType;
  value: number;
};

export type DishwasherKPI = {
  type: DishwasherKPIType;
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

export const ShowerEfficiencyMetric = z.object({
  consumptionBenchmark: ConsumptionPerDayPerPersonBenchmark,
  thresholds: Thresholds,
  kpis: z.array(z.custom<ShowerKPI>()),
});
export type ShowerEfficiencyMetric = z.infer<typeof ShowerEfficiencyMetric>;

export const ToiletEfficiencyMetric = z.object({
  consumptionBenchmark: ConsumptionPerDayPerPersonBenchmark,
  thresholds: Thresholds,
  kpis: z.array(z.custom<ToiletKPI>()),
});
export type ToiletEfficiencyMetric = z.infer<typeof ToiletEfficiencyMetric>;

export const WasherEfficiencyMetric = z.object({
  consumptionBenchmark: ConsumptionPerDayPerPersonBenchmark,
  thresholds: Thresholds,
  kpis: z.array(z.custom<WasherKPI>()),
});
export type WasherEfficiencyMetric = z.infer<typeof WasherEfficiencyMetric>;

export const DishwasherEfficiencyMetric = z.object({
  consumptionBenchmark: ConsumptionPerDayPerPersonBenchmark,
  thresholds: Thresholds,
  kpis: z.array(z.custom<DishwasherKPI>()),
});
export type DishwasherEfficiencyMetric = z.infer<typeof DishwasherEfficiencyMetric>;

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
  byCategory: z.object({
    shower: ShowerEfficiencyMetric,
    toilet: ToiletEfficiencyMetric,
    washer: WasherEfficiencyMetric,
    dishwasher: DishwasherEfficiencyMetric,
  }),
  recommendations: z.array(Recommendation),
});
export type Efficiency = z.infer<typeof Efficiency>;

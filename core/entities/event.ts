import { z } from "zod";
import { Category } from "@core/entities/category";
import { Label } from "@core/entities/label";

export const Event = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  consumptionInLiters: z.number(),
  notes: z.array(z.string()),

  category: Category,
  label: Label.optional(),
});

export type Event = z.infer<typeof Event>;

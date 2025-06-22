import { z } from "zod";

import { Category } from "@domain/entities/category";

export const Event = z.object({
  id: z.string(),
  category: Category,
  startTimestamp: z.date(),
  endTimestamp: z.date(),
  durationInSeconds: z.number().nonnegative(),
  consumptionInLiters: z.number().nonnegative(),
  tag: z.string().optional(),
  notes: z.array(z.string()),
});

export type Event = z.infer<typeof Event>;

export const EventsForDay = z.object({
  date: z.date(),
  events: z.array(Event),
  totalConsumption: z.number().nonnegative(),
});

export type EventsForDay = z.infer<typeof EventsForDay>;

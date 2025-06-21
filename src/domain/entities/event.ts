import { z } from "zod";

import { Category } from "@domain/entities/category";

export const Event = z.object({
  id: z.string(),
  category: Category,

  startTimestamp: z.date(),
  endTimestamp: z.date(),
  consumptionInLiters: z.number().min(0),
  notes: z.array(z.string()),
  tag: z.string().optional(),
});

export type Event = z.infer<typeof Event>;

export const EventsForDay = z.object({
  date: z.date(),
  events: z.array(Event),
  totalConsumption: z.number().positive(),
});

export type EventsForDay = z.infer<typeof EventsForDay>;

import { z } from "zod";

import { Category } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";

export const Event = z.object({
  id: z.string(),
  category: Category,
  categorySource: z.enum(["algorithm", "user"]).optional(),
  algorithmCategory: Category.optional(),
  algorithmConfidence: z.number().min(0).max(1).optional(),
  userCategory: Category.optional(),
  startTimestamp: z.date(),
  endTimestamp: z.date(),
  durationInSeconds: z.number().nonnegative(),
  consumptionInLiters: z.number().nonnegative(),
  tag: Tag.optional(),
  notes: z.string().optional(),
});

export type Event = z.infer<typeof Event>;

export const EventsForDay = z.object({
  date: z.date(),
  events: z.array(Event),
  totalConsumption: z.number().nonnegative(),
});

export type EventsForDay = z.infer<typeof EventsForDay>;

export const createEventInput = z
  .object({
    householdId: z.string(),
    category: Category,
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    tagId: z.number().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.startDate || data.endDate;
    },
    {
      message: "validation.eitherStartOrEndRequired",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "validation.endCannotBeBeforeStart",
      path: ["endDate"],
    }
  );

export const updateEventInput = z.object({
  eventId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  category: Category.optional(),
  tagId: z.number().optional(),
  notes: z.string().optional(),
});

export const updateEventForm = z.object({
  category: Category.nullable(),
  tag: Tag.nullable(),
  notes: z.string().nullable(),
});

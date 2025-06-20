import { format, startOfDay } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Category } from "@domain/entities/category";
import { Event, EventsForDay } from "@domain/entities/event";

export const eventRouter = createTRPCRouter({
  getEvents: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(z.array(Event))
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate } = input;
      const events = await ctx.eventRepo.getEvents(householdId, startDate, endDate);
      return events;
    }),

  getEventsSortedByTimestamp: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        order: z.enum(["asc", "desc"]).default("desc"),
        cursor: z.object({ date: z.date(), id: z.string() }).nullish(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .output(
      z.object({
        data: z.array(Event),
        nextCursor: z.object({ date: z.date(), id: z.string() }).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate, order, cursor, limit } = input;
      const events = await ctx.eventRepo.getEventsSortedByTimestamp(
        householdId,
        startDate || new Date(0),
        endDate || new Date(),
        order,
        cursor ? { date: new Date(cursor.date), id: cursor.id } : undefined,
        limit
      );

      const nextCursor =
        events.length === limit
          ? {
              date: events[events.length - 1].startDate,
              id: events[events.length - 1].id,
            }
          : undefined;

      return {
        data: events,
        nextCursor,
      };
    }),

  getEventsSortedByConsumption: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        categories: z.array(Category).optional(),
        order: z.enum(["asc", "desc"]).default("desc"),
        cursor: z.object({ consumption: z.number(), id: z.string() }).nullish(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .output(
      z.object({
        data: z.array(Event),
        nextCursor: z.object({ consumption: z.number(), id: z.string() }).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate, categories, limit, order, cursor } = input;
      const events = await ctx.eventRepo.getEventsSortedByConsumption(
        householdId,
        startDate,
        endDate,
        categories || undefined,
        order,
        cursor ? { consumption: cursor.consumption, id: cursor.id } : undefined,
        limit
      );

      const nextCursor =
        events.length === limit
          ? {
              consumption: events[events.length - 1].consumptionInLiters,
              id: events[events.length - 1].id,
            }
          : undefined;

      return {
        data: events,
        nextCursor,
      };
    }),

  getLeakEvents: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(z.array(Event))
    .query(async ({ input, ctx }) => {
      const events = await ctx.eventRepo.getLeakEvents(input.householdId);
      return events;
    }),

  getUnknownEvents: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(z.array(Event))
    .query(async ({ input, ctx }) => {
      const events = await ctx.eventRepo.getUnknownEvents(input.householdId);
      return events;
    }),

  getNumberOfLeakEvents: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(z.number())
    .query(async ({ input, ctx }) => {
      const leaks = await ctx.eventRepo.getNumberOfLeakEvents(input.householdId);
      return leaks;
    }),

  getNumberOfUnknownEvents: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(z.number())
    .query(async ({ input, ctx }) => {
      const unknowns = await ctx.eventRepo.getNumberOfUnknownEvents(input.householdId);
      return unknowns;
    }),

  getEventsGroupedByDay: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        cursor: z.object({ date: z.date(), id: z.string() }).nullish().nullish(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .output(
      z.object({
        data: z.array(EventsForDay),
        nextCursor: z.object({ date: z.date(), id: z.string() }).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { householdId, cursor, limit } = input;

      const events = await ctx.eventRepo.getEventsSortedByTimestamp(
        householdId,
        undefined,
        undefined,
        "desc",
        cursor ? { date: new Date(cursor.date), id: cursor.id } : undefined,
        limit
      );

      const groupedEventsMap: { [key: string]: EventsForDay } = {};

      for (const event of events) {
        const dayKey = format(startOfDay(event.startDate), "yyyy-MM-dd");

        if (!groupedEventsMap[dayKey]) {
          groupedEventsMap[dayKey] = {
            date: startOfDay(event.startDate),
            events: [],
            totalConsumption: 0,
          };
        }
        groupedEventsMap[dayKey].events.push(event);
        groupedEventsMap[dayKey].totalConsumption += event.consumptionInLiters;
      }

      const groupedData = Object.values(groupedEventsMap).sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      const nextCursor =
        events.length === limit
          ? {
              date: events[events.length - 1].startDate,
              id: events[events.length - 1].id,
            }
          : undefined;

      return {
        data: groupedData,
        nextCursor,
      };
    }),
});

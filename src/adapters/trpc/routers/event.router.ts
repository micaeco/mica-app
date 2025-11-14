import { format, startOfDay, subHours } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Category } from "@domain/entities/category";
import { NotFoundError, UnauthorizedError } from "@domain/entities/errors";
import { Event, EventsForDay } from "@domain/entities/event";

const hoursBeforeNowForLeakEvents = 3;
const hoursBeforeNowForUnknownEvents = 3;

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        category: Category,
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        tagId: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { householdId, startDate, endDate, category, tagId, notes } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      if (!(await ctx.householdRepo.exists(householdId))) {
        throw new NotFoundError("Household");
      }

      await ctx.eventRepo.create(
        ctx.user.id,
        householdId,
        category,
        startDate,
        endDate,
        tagId,
        notes
      );
    }),

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

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const events = await ctx.eventRepo.getEvents(
        householdId,
        startDate || new Date(0),
        endDate || new Date(),
        undefined,
        "timestamp",
        order,
        cursor ? { timestamp: new Date(cursor.date), id: cursor.id } : undefined,
        limit
      );

      const nextCursor =
        events.length === limit
          ? {
              date: events[events.length - 1].startTimestamp,
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

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const events = await ctx.eventRepo.getEvents(
        householdId,
        startDate,
        endDate,
        categories || undefined,
        "consumption",
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
    .input(
      z.object({
        householdId: z.string(),
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
      const { householdId, order, cursor, limit } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const endDate = new Date();
      const startDate = new Date(subHours(endDate, hoursBeforeNowForLeakEvents));

      const events = await ctx.eventRepo.getEvents(
        householdId,
        startDate,
        endDate,
        ["leak"],
        "timestamp",
        order,
        cursor ? { timestamp: new Date(cursor.date), id: cursor.id } : undefined,
        limit
      );

      const nextCursor =
        events.length === limit
          ? {
              date: events[events.length - 1].startTimestamp,
              id: events[events.length - 1].id,
            }
          : undefined;

      return {
        data: events,
        nextCursor,
      };
    }),

  getUnknownEvents: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
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
      const { householdId, order, cursor, limit } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const endDate = new Date();
      const startDate = new Date(subHours(endDate, hoursBeforeNowForUnknownEvents));

      const events = await ctx.eventRepo.getEvents(
        householdId,
        startDate,
        endDate,
        ["unknown"],
        "timestamp",
        order,
        cursor ? { timestamp: new Date(cursor.date), id: cursor.id } : undefined,
        limit
      );

      const nextCursor =
        events.length === limit
          ? {
              date: events[events.length - 1].startTimestamp,
              id: events[events.length - 1].id,
            }
          : undefined;

      return {
        data: events,
        nextCursor,
      };
    }),

  getNumberOfLeakEvents: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(z.number())
    .query(async ({ input, ctx }) => {
      const { householdId } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const endDate = new Date();
      const startDate = new Date(subHours(endDate, hoursBeforeNowForLeakEvents));

      const leaks = await ctx.eventRepo.getNumberOfLeakEvents(householdId, startDate, endDate);
      return leaks;
    }),

  getNumberOfUnknownEvents: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(z.number())
    .query(async ({ input, ctx }) => {
      const { householdId } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const endDate = new Date();
      const startDate = new Date(subHours(endDate, hoursBeforeNowForUnknownEvents));

      const unknowns = await ctx.eventRepo.getNumberOfUnknownEvents(
        householdId,
        startDate,
        endDate
      );
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

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const events = await ctx.eventRepo.getEvents(
        householdId,
        undefined,
        undefined,
        undefined,
        "timestamp",
        "desc",
        cursor ? { timestamp: new Date(cursor.date), id: cursor.id } : undefined,
        limit
      );

      const groupedEventsMap: { [key: string]: EventsForDay } = {};

      for (const event of events) {
        const dayKey = format(startOfDay(event.startTimestamp), "yyyy-MM-dd");

        if (!groupedEventsMap[dayKey]) {
          groupedEventsMap[dayKey] = {
            date: startOfDay(event.startTimestamp),
            events: [],
            totalConsumption: 0,
          };
        }
        groupedEventsMap[dayKey].events.push(event);
      }

      for (const day in groupedEventsMap) {
        const dayConsumption = await ctx.consumptionRepo.getConsumptionByGranularity(
          householdId,
          "day",
          groupedEventsMap[day].events[0].startTimestamp,
          groupedEventsMap[day].events[0].startTimestamp
        );

        groupedEventsMap[day].totalConsumption = dayConsumption[0].consumptionInLiters;
      }

      const groupedData = Object.values(groupedEventsMap).sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      const nextCursor =
        events.length === limit
          ? {
              date: events[events.length - 1].startTimestamp,
              id: events[events.length - 1].id,
            }
          : undefined;

      return {
        data: groupedData,
        nextCursor,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        category: Category.optional(),
        tagId: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId, startDate, endDate, category, tagId, notes } = input;

      await ctx.eventRepo.update(ctx.user.id, eventId, startDate, endDate, category, tagId, notes);
    }),
});

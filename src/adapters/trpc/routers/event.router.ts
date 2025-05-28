import { startOfDay, subDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Event, EventsForDay } from "@domain/entities/event";

export const eventRouter = createTRPCRouter({
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

  getPaginatedEventsGroupedByDay: protectedProcedure
    .input(
      z.object({
        sensorId: z.string(),
        cursor: z.string().datetime().nullish(),
        numberOfDays: z.number().min(1).default(7),
      })
    )
    .output(z.object({ data: z.array(EventsForDay), nextCursor: z.string().datetime().optional() }))
    .query(async ({ input, ctx }) => {
      const { sensorId, cursor, numberOfDays } = input;

      let startDate: Date;

      if (cursor) {
        startDate = startOfDay(new Date(cursor));
      } else {
        startDate = startOfDay(new Date());
      }

      const groupedData: EventsForDay[] = [];
      let currentDay = new Date(startDate);

      for (let i = 0; i < numberOfDays; i++) {
        const eventsForThisDay = await ctx.eventRepo.getEventsForDay(sensorId, currentDay);

        if (eventsForThisDay.length > 0) {
          const dayData: EventsForDay = {
            date: startOfDay(currentDay),
            events: eventsForThisDay,
            totalConsumption: eventsForThisDay.reduce(
              (sum, event) => sum + (event.consumptionInLiters || 0),
              0
            ),
          };
          groupedData.push(dayData);
        }

        currentDay = subDays(currentDay, 1);
      }

      const nextCursor =
        groupedData.length < numberOfDays && cursor !== null
          ? undefined
          : groupedData.length > 0
            ? startOfDay(subDays(groupedData[groupedData.length - 1].date, 1)).toISOString()
            : undefined;

      return {
        data: groupedData,
        nextCursor,
      };
    }),
});

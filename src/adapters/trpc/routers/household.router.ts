import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Consumption } from "@domain/entities/consumption";

export const householdRouter = createTRPCRouter({
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

  getCurrentMonthConsumption: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(Consumption)
    .query(async ({ input, ctx }) => {
      const consumption = await ctx.consumptionRepo.getCurrentMonthConsumption(input.householdId);
      return consumption;
    }),

  getCurrentDayConsumption: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(Consumption)
    .query(async ({ input, ctx }) => {
      const consumption = await ctx.consumptionRepo.getCurrentDayConsumption(input.householdId);
      return consumption;
    }),
});

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Consumption, Granularity } from "@domain/entities/consumption";

export const consumptionRouter = createTRPCRouter({
  getConsumption: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(Consumption)
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate } = input;
      const consumption = await ctx.consumptionRepo.getConsumption(householdId, startDate, endDate);
      return consumption;
    }),

  getConsumptionByGranularity: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        granularity: Granularity,
      })
    )
    .output(z.array(Consumption))
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate, granularity } = input;
      const consumption = await ctx.consumptionRepo.getConsumptionByGranularity(
        householdId,
        startDate,
        endDate,
        granularity
      );
      return consumption;
    }),

  getCurrentMonthConsumption: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(Consumption.nullable())
    .query(async ({ input, ctx }) => {
      const consumption = await ctx.consumptionRepo.getCurrentMonthConsumption(input.householdId);
      return consumption || null;
    }),

  getCurrentDayConsumption: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(Consumption.nullable())
    .query(async ({ input, ctx }) => {
      const consumption = await ctx.consumptionRepo.getCurrentDayConsumption(input.householdId);
      return consumption || null;
    }),
});

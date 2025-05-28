import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Consumption } from "@domain/entities/consumption";

export const consumptionRouter = createTRPCRouter({
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

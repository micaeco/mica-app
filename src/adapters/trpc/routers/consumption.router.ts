import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Consumption } from "@domain/entities/consumption";

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

  getMonthlyConsumption: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(z.array(Consumption))
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate } = input;
      const consumption = await ctx.consumptionRepo.getMonthlyConsumption(
        householdId,
        startDate,
        endDate
      );
      return consumption;
    }),

  getWeeklyConsumption: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(z.array(Consumption))
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate } = input;
      const consumption = await ctx.consumptionRepo.getWeeklyConsumption(
        householdId,
        startDate,
        endDate
      );
      return consumption;
    }),

  getDailyConsumption: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(z.array(Consumption))
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate } = input;
      const consumption = await ctx.consumptionRepo.getDailyConsumption(
        householdId,
        startDate,
        endDate
      );
      return consumption;
    }),

  getHourlyConsumption: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(z.array(Consumption))
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate } = input;
      const consumption = await ctx.consumptionRepo.getHourlyConsumption(
        householdId,
        startDate,
        endDate
      );
      return consumption;
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

import { TRPCError } from "@trpc/server";
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

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const consumption = await ctx.consumptionRepo.getConsumption(householdId, startDate, endDate);
      return consumption;
    }),

  getConsumptionByGranularity: protectedProcedure
    .input(
      z.object({
        householdId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        granularity: Granularity,
        order: z.enum(["asc", "desc"]).optional(),
        cursor: z.object({ timestamp: z.date() }).nullish(),
        limit: z.number().min(1).default(10),
      })
    )
    .output(
      z.object({
        data: z.array(Consumption),
        nextCursor: z.object({ timestamp: z.date() }).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { householdId, startDate, endDate, granularity, order, cursor, limit } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const queryLimit = limit + 1;

      const consumption = await ctx.consumptionRepo.getConsumptionByGranularity(
        householdId,
        granularity,
        startDate,
        endDate,
        order,
        cursor || undefined,
        queryLimit
      );

      let nextCursor: { timestamp: Date } | undefined = undefined;

      if (consumption.length > limit) {
        nextCursor = { timestamp: consumption[limit - 1].startDate };
        consumption.pop();
      }

      return {
        data: consumption,
        nextCursor,
      };
    }),

  getCurrentMonthConsumption: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(Consumption.nullable())
    .query(async ({ input, ctx }) => {
      const { householdId } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const consumption = await ctx.consumptionRepo.getCurrentMonthConsumption(householdId);
      return consumption || null;
    }),

  getCurrentDayConsumption: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .output(Consumption.nullable())
    .query(async ({ input, ctx }) => {
      const { householdId } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const consumption = await ctx.consumptionRepo.getCurrentDayConsumption(householdId);
      return consumption || null;
    }),
});

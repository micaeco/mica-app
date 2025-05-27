import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { Category } from "@domain/entities/category";
import { Consumption } from "@domain/entities/consumption";
import { Tag } from "@domain/entities/tag";

export const homeRouter = createTRPCRouter({
  getHouseholdCategoryTags: protectedProcedure
    .input(z.object({ householdId: z.string(), category: Category }))
    .output(z.array(Tag))
    .query(async ({ input, ctx }) => {
      const tags = await ctx.tagRepo.getHouseholdTags(input.householdId);
      return tags.filter((tag) => tag.category == input.category);
    }),

  createHouseholdTag: protectedProcedure
    .input(Tag)
    .output(Tag)
    .mutation(async ({ input, ctx }) => {
      const createdTag = await ctx.tagRepo.create(input);
      return createdTag;
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

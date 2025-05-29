import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { createHousehold } from "@domain/entities/household";

export const householdRouter = createTRPCRouter({
  findAllHouseholds: protectedProcedure.query(async ({ ctx }) => {
    const households = await ctx.householdRepo.findAll();
    return households;
  }),

  createHousehold: protectedProcedure.input(createHousehold).mutation(async ({ input, ctx }) => {
    const household = await ctx.householdRepo.create(input);
    return household;
  }),

  updateHousehold: protectedProcedure
    .input(
      createHousehold.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const household = await ctx.householdRepo.update(id, data);
      return household;
    }),

  deleteHousehold: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    await ctx.householdRepo.delete(input);
    return { id: input };
  }),
});

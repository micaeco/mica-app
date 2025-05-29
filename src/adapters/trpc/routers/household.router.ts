import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { createHousehold } from "@domain/entities/household";

export const householdRouter = createTRPCRouter({
  findAllHouseholds: protectedProcedure.query(async ({ ctx }) => {
    const households = await ctx.householdRepo.findAll();
    return households;
  }),

  createHousehold: protectedProcedure.input(createHousehold).mutation(async ({ input, ctx }) => {
    setTimeout(() => {}, 1000);
    const household = await ctx.householdRepo.create(input);
    return household;
  }),
});

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";

export const householdRouter = createTRPCRouter({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const households = await ctx.householdRepo.findAll();
    return households;
  }),
});

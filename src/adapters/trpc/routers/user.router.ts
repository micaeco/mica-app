import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";

export const userRouter = createTRPCRouter({
  findAllHouseholds: protectedProcedure.query(async ({ ctx }) => {
    const households = await ctx.householdUserRepo.findHouseholdsByUserId(ctx.user.id);
    return households;
  }),
});

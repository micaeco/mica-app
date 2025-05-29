import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { BadRequestError } from "@domain/entities/errors";
import { createHousehold, Household } from "@domain/entities/household";
import { HouseholdUser } from "@domain/entities/household-user";

export const householdRouter = createTRPCRouter({
  findAllHouseholds: protectedProcedure.output(z.array(Household)).query(async ({ ctx }) => {
    const householdIds = await ctx.householdUserRepo.findHouseholdsByUserId(ctx.user.id);

    const households = [];
    for (const householdId of householdIds) {
      const household = await ctx.householdRepo.findById(householdId);
      if (household) households.push(household);
    }

    return households;
  }),

  createHousehold: protectedProcedure.input(createHousehold).mutation(async ({ input, ctx }) => {
    if (ctx.sensorRepo.findById(input.sensorId) == null) {
      throw new BadRequestError();
    }

    if (ctx.householdRepo.findBySensorId(input.sensorId)) {
      throw new BadRequestError();
    }

    const household = await ctx.householdRepo.create(input);

    const householdUser: HouseholdUser = {
      householdId: household.id,
      userId: ctx.user.id,
      role: "admin",
    };

    await ctx.householdUserRepo.create(householdUser);
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

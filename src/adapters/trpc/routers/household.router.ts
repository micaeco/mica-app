import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { BadRequestError } from "@domain/entities/errors";
import { createHousehold, Household } from "@domain/entities/household";
import { HouseholdUser } from "@domain/entities/household-user";
import { Repositories } from "@domain/services/unit-of-work";

export const householdRouter = createTRPCRouter({
  findAllHouseholds: protectedProcedure.output(z.array(Household)).query(async ({ ctx }) => {
    const householdIds = await ctx.householdUserRepo.findHouseholdsByUserId(ctx.user.sub);

    const households = [];
    for (const householdId of householdIds) {
      const household = await ctx.householdRepo.findById(householdId);
      if (household) households.push(household);
    }

    return households;
  }),

  createHousehold: protectedProcedure.input(createHousehold).mutation(async ({ input, ctx }) => {
    if (!(await ctx.sensorRepo.exists(input.sensorId))) {
      throw new BadRequestError();
    }

    if (await ctx.householdRepo.findBySensorId(input.sensorId)) {
      throw new BadRequestError();
    }

    const household = await ctx.unitOfWork.execute(async (repos: Repositories) => {
      const household = await repos.householdRepo.create(input);

      const householdUser: HouseholdUser = {
        householdId: household.id,
        userId: ctx.user.sub,
        role: "admin",
      };

      await repos.householdUserRepo.create(householdUser);

      await ctx.sensorRepo.assignHouseholdToSensor(input.sensorId, household.id);
    });

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

      if (input.sensorId) {
        const sensor = await ctx.sensorRepo.findById(input.sensorId);
        if (sensor === null) {
          throw new BadRequestError();
        }

        const existingHousehold = await ctx.householdRepo.findBySensorId(input.sensorId);
        if (existingHousehold && existingHousehold.id !== id) {
          throw new BadRequestError();
        }
      }

      const household = await ctx.householdRepo.update(id, data);
      return household;
    }),

  deleteHousehold: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    await ctx.householdRepo.delete(input);
    return { id: input };
  }),
});

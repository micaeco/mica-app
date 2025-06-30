import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import { HouseholdSensorAlreadyExistsError, SensorNotFoundError } from "@domain/entities/errors";
import { createHousehold, Household } from "@domain/entities/household";
import { HouseholdUser } from "@domain/entities/household-user";
import { Repositories } from "@domain/services/unit-of-work";

export const householdRouter = createTRPCRouter({
  create: protectedProcedure.input(createHousehold).mutation(async ({ input, ctx }) => {
    if (!(await ctx.sensorRepo.exists(input.sensorId))) {
      throw new SensorNotFoundError();
    }

    if (await ctx.householdRepo.findBySensorId(input.sensorId)) {
      throw new HouseholdSensorAlreadyExistsError();
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

  getAll: protectedProcedure.output(z.array(Household)).query(async ({ ctx }) => {
    const householdIds = await ctx.householdUserRepo.findHouseholdsByUserId(ctx.user.sub);

    const households = [];
    for (const householdId of householdIds) {
      const household = await ctx.householdRepo.findById(householdId);
      if (household) households.push(household);
    }

    return households;
  }),

  update: protectedProcedure
    .input(
      createHousehold.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      if (!ctx.userHouseholds.includes(id)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (input.sensorId) {
        if (!(await ctx.sensorRepo.exists(input.sensorId))) {
          throw new SensorNotFoundError();
        }

        const existingHousehold = await ctx.householdRepo.findBySensorId(input.sensorId);
        if (existingHousehold && existingHousehold.id !== id) {
          throw new HouseholdSensorAlreadyExistsError();
        }
      }

      const household = await ctx.householdRepo.update(id, data);
      return household;
    }),

  delete: protectedProcedure
    .input(z.object({ sensorId: z.string(), householdId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userHouseholds.includes(input.householdId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.sensorRepo.unassignHouseholdFromSensor(input.sensorId, input.householdId);
      await ctx.householdRepo.delete(input.householdId);
      return { id: input.householdId };
    }),
});

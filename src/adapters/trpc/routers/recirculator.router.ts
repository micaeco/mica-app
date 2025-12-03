import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import {
  deviceIdInput,
  PowerState,
  RecirculatorStatus,
  setMaxTemperatureInput,
  TemperatureReading,
} from "@domain/entities/recirculator";

export const recirculatorRouter = createTRPCRouter({
  getState: protectedProcedure
    .input(deviceIdInput)
    .output(PowerState)
    .query(async ({ input, ctx }) => {
      return await ctx.recirculatorService.getState(input.deviceId);
    }),

  turnOn: protectedProcedure.input(deviceIdInput).mutation(async ({ input, ctx }) => {
    await ctx.recirculatorService.turnOn(input.deviceId);
  }),

  turnOff: protectedProcedure.input(deviceIdInput).mutation(async ({ input, ctx }) => {
    await ctx.recirculatorService.turnOff(input.deviceId);
  }),

  setMaxTemperature: protectedProcedure
    .input(setMaxTemperatureInput)
    .mutation(async ({ input, ctx }) => {
      await ctx.recirculatorService.setMaxTemperature(input.deviceId, input.maxTemperature);
    }),

  getLastTemperature: protectedProcedure
    .input(deviceIdInput)
    .output(TemperatureReading.nullable())
    .query(async ({ input, ctx }) => {
      return await ctx.recirculatorService.getLastTemperature(input.deviceId);
    }),

  getStatus: protectedProcedure
    .input(deviceIdInput)
    .output(RecirculatorStatus)
    .query(async ({ input, ctx }) => {
      return await ctx.recirculatorService.getStatus(input.deviceId);
    }),
});

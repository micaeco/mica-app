import { consumptionRouter } from "@adapters/trpc/routers/consumption.router";
import { eventRouter } from "@adapters/trpc/routers/event.router";
import { householdRouter } from "@adapters/trpc/routers/household.router";
import { recirculatorRouter } from "@adapters/trpc/routers/recirculator.router";
import { tagRouter } from "@adapters/trpc/routers/tag.router";
import { createTRPCRouter } from "@adapters/trpc/trpc";

export const appRouter = createTRPCRouter({
  tag: tagRouter,
  event: eventRouter,
  household: householdRouter,
  consumption: consumptionRouter,
  recirculator: recirculatorRouter,
});

export type AppRouter = typeof appRouter;

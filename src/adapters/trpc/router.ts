import { eventRouter } from "@adapters/trpc/routers/event.router";
import { homeRouter } from "@adapters/trpc/routers/home.router";
import { createTRPCRouter } from "@adapters/trpc/trpc";

export const appRouter = createTRPCRouter({
  home: homeRouter,
  event: eventRouter,
});

export type AppRouter = typeof appRouter;

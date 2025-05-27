import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "@adapters/trpc/context";
import { appRouter } from "@adapters/trpc/router";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
};

export { handler as GET, handler as POST };

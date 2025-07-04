import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "@adapters/trpc/context";
import { appRouter } from "@adapters/trpc/router";
import { env } from "@env";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };

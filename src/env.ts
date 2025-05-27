import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH0_SECRET: z.string(),
    AUTH0_CLIENT_ID: z.string(),
    AUTH0_DOMAIN: z.string().url(),
    AUTH0_CLIENT_SECRET: z.string(),
  },

  client: {
    NEXT_PUBLIC_URL: z.string(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_URL:
      process.env.NODE_ENV == "production" ? "https://app.mica.eco" : "http://localhost:3000",

    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  },

  emptyStringAsUndefined: true,
});

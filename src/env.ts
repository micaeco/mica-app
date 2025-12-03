import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),

    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),

    AWS_API_GATEWAY_URL: z.string().url(),
    AWS_API_GATEWAY_TOKEN: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),

    AWS_IOT_ENDPOINT: z.string(),

    DATABASE_URL: z.string().url(),
    DATABASE_URL_UNPOOLED: z.string().url(),
  },

  client: {
    NEXT_PUBLIC_URL: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    NEXT_PUBLIC_URL:
      process.env.NODE_ENV === "production" ? "https://app.mica.eco" : "http://localhost:3000",

    BETTER_AUTH_URL:
      process.env.NODE_ENV === "production" ? "https://app.mica.eco" : "http://localhost:3000",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    AWS_API_GATEWAY_URL: process.env.AWS_API_GATEWAY_URL,
    AWS_API_GATEWAY_TOKEN: process.env.AWS_API_GATEWAY_TOKEN,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    AWS_IOT_ENDPOINT: process.env.AWS_IOT_ENDPOINT,

    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
  },

  emptyStringAsUndefined: true,
});

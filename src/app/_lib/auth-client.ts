import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "@adapters/auth";
import { env } from "@env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_URL as string,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type ErrorTypes = keyof typeof authClient.$ERROR_CODES;

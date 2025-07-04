import { createAuthClient } from "better-auth/react";

import { env } from "env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_URL as string,
});

export type ErrorTypes = keyof typeof authClient.$ERROR_CODES;

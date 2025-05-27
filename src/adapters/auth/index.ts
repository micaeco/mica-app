import { Auth0Client } from "@auth0/nextjs-auth0/server";

import { env } from "env";

export const auth = new Auth0Client({
  secret: env.AUTH0_SECRET,
  domain: env.AUTH0_DOMAIN,
  clientId: env.AUTH0_CLIENT_ID,
  clientSecret: env.AUTH0_CLIENT_SECRET,
  appBaseUrl: env.NEXT_PUBLIC_URL,
});

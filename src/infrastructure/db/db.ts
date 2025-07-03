import { drizzle } from "drizzle-orm/node-postgres";

import { household } from "@infrastructure/db/schema/app/household";
import { householdUser } from "@infrastructure/db/schema/app/household-user";
import { tag } from "@infrastructure/db/schema/app/tag";
import { account } from "@infrastructure/db/schema/auth/account";
import { session } from "@infrastructure/db/schema/auth/session";
import { user } from "@infrastructure/db/schema/auth/user";
import { verification } from "@infrastructure/db/schema/auth/verification";
import { env } from "env";

export const schema = {
  household,
  householdUser,
  tag,
  user,
  account,
  session,
  verification,
};

export type Schema = typeof schema;

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
  schema,
});

export type DbType = typeof db;

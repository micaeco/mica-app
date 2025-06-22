import { drizzle } from "drizzle-orm/node-postgres";

import { householdSchema } from "@infrastructure/db/schema/household";
import { householdUserSchema } from "@infrastructure/db/schema/household-user";
import { tagSchema } from "@infrastructure/db/schema/tag";
import { env } from "env";

export const schema = {
  household: householdSchema,
  householdUser: householdUserSchema,
  tag: tagSchema,
};

export type Schema = typeof schema;

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
  schema: {
    household: householdSchema,
    householdUser: householdUserSchema,
    tag: tagSchema,
  },
});

export type DbType = typeof db;

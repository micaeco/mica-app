import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@env";
import { household } from "@infrastructure/db/schema/app/household";
import { householdUser } from "@infrastructure/db/schema/app/household-user";
import { tag } from "@infrastructure/db/schema/app/tag";
import { account } from "@infrastructure/db/schema/auth/account";
import { session } from "@infrastructure/db/schema/auth/session";
import { user } from "@infrastructure/db/schema/auth/user";
import { verification } from "@infrastructure/db/schema/auth/verification";

export const schema = {
  household,
  householdUser,
  tag,
  user,
  account,
  session,
  verification,
};

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export type Schema = typeof schema;
export type DbType = typeof db;

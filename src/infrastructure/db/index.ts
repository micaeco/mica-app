import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import ws from "ws";

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

let db: ReturnType<typeof drizzleNode> | ReturnType<typeof drizzleNeon>;

if (env.NODE_ENV === "production") {
  db = drizzleNeon({
    connection: env.DATABASE_URL,
    ws: ws,
    schema,
  });
} else {
  db = drizzleNode({
    connection: {
      connectionString: env.DATABASE_URL,
    },
    schema,
  });
}

export { db };

export type Schema = typeof schema;
export type DbType = typeof db;

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, {
  // schema,
  logger: process.env.NODE_ENV === "development",
});

export type DbType = typeof db;

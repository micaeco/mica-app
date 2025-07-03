import { text, timestamp } from "drizzle-orm/pg-core";

import { authSchema } from "@infrastructure/db/schema/auth/schema";
import { user } from "@infrastructure/db/schema/auth/user";

export const session = authSchema.table("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { householdSchema } from "@infrastructure/db/schema/household";

export const householdUserSchema = pgTable("household_users", {
  id: serial("id").primaryKey(),
  householdId: text("household_id")
    .notNull()
    .references(() => householdSchema.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const householdUsersRelations = relations(householdUserSchema, ({ one }) => ({
  household: one(householdSchema, {
    fields: [householdUserSchema.householdId],
    references: [householdSchema.id],
  }),
}));

export type HouseholdUserSchema = typeof householdUserSchema.$inferSelect;
export type NewHouseholdUserSchema = typeof householdUserSchema.$inferInsert;

import { relations } from "drizzle-orm";
import { serial, text, timestamp } from "drizzle-orm/pg-core";

import { household } from "@infrastructure/db/schema/app/household";
import { appSchema } from "@infrastructure/db/schema/app/schema";

export const householdUser = appSchema.table("household_users", {
  id: serial("id").primaryKey(),
  householdId: text("household_id")
    .notNull()
    .references(() => household.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const householdUsersRelations = relations(householdUser, ({ one }) => ({
  household: one(household, {
    fields: [householdUser.householdId],
    references: [household.id],
  }),
}));

export type HouseholdUser = typeof householdUser.$inferSelect;
export type NewHouseholdUser = typeof householdUser.$inferInsert;

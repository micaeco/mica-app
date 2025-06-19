import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { householdSchema } from "@infrastructure/db/schema/household";

export const tagSchema = pgTable("tags", {
  id: serial("id").primaryKey(),
  householdId: text("household_id")
    .notNull()
    .references(() => householdSchema.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tagsRelations = relations(tagSchema, ({ one }) => ({
  household: one(householdSchema, {
    fields: [tagSchema.householdId],
    references: [householdSchema.id],
  }),
}));

export type TagSchema = typeof tagSchema.$inferSelect;
export type NewTagSchema = typeof tagSchema.$inferInsert;

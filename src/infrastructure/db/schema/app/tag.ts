import { relations } from "drizzle-orm";
import { serial, text, timestamp } from "drizzle-orm/pg-core";

import { household } from "@infrastructure/db/schema/app/household";
import { appSchema } from "@infrastructure/db/schema/app/schema";

export const tag = appSchema.table("tags", {
  id: serial("id").primaryKey(),
  householdId: text("household_id")
    .notNull()
    .references(() => household.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tagsRelations = relations(tag, ({ one }) => ({
  household: one(household, {
    fields: [tag.householdId],
    references: [household.id],
  }),
}));

export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;

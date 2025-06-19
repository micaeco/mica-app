import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { householdUserSchema } from "@infrastructure/db/schema/household-user";
import { tagSchema } from "@infrastructure/db/schema/tag";

export const householdSchema = pgTable("households", {
  id: text("id").primaryKey(),
  sensorId: text("sensor_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
  residents: integer("residents").notNull(),
  street1: text("street1"),
  street2: text("street2"),
  city: text("city"),
  zip: text("zip"),
  country: text("country"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const householdsRelations = relations(householdSchema, ({ many }) => ({
  householdUsers: many(householdUserSchema),
  tags: many(tagSchema),
}));

export type HouseholdSchema = typeof householdSchema.$inferSelect;
export type NewHouseholdSchema = typeof householdSchema.$inferInsert;

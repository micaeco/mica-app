import { relations } from "drizzle-orm";
import { integer, text, timestamp } from "drizzle-orm/pg-core";

import { householdUser } from "@infrastructure/db/schema/app/household-user";
import { appSchema } from "@infrastructure/db/schema/app/schema";
import { tag } from "@infrastructure/db/schema/app/tag";

export const household = appSchema.table("households", {
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

export const householdsRelations = relations(household, ({ many }) => ({
  householdUsers: many(householdUser),
  tags: many(tag),
}));

export type Household = typeof household.$inferSelect;
export type NewHousehold = typeof household.$inferInsert;

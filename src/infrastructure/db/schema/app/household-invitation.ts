import { relations } from "drizzle-orm";
import { serial, text, timestamp } from "drizzle-orm/pg-core";

import { household } from "@infrastructure/db/schema/app/household";
import { appSchema } from "@infrastructure/db/schema/app/schema";
import { user } from "@infrastructure/db/schema/auth/user";

export const householdInvitation = appSchema.table("household_invitations", {
  id: serial("id").primaryKey(),
  householdId: text("household_id")
    .notNull()
    .references(() => household.id, { onDelete: "cascade" }),
  invitedEmail: text("invited_email").notNull(),
  token: text("token").notNull().unique(),
  inviterUserId: text("inviter_user_id").references(() => user.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
});

export const householdInvitationsRelations = relations(householdInvitation, ({ one }) => ({
  household: one(household, {
    fields: [householdInvitation.householdId],
    references: [household.id],
  }),
  inviter: one(user, {
    fields: [householdInvitation.inviterUserId],
    references: [user.id],
  }),
}));

export type HouseholdInvitation = typeof householdInvitation.$inferSelect;
export type NewHouseholdInvitation = typeof householdInvitation.$inferInsert;

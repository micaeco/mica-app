import { z } from "zod";

export const HouseholdInvitation = z.object({
  id: z.number().int().positive(),
  householdId: z.string().uuid(),
  invitedEmail: z.string().email(),
  token: z.string().uuid(),
  inviterUserId: z.string().uuid().nullable(),
  status: z.enum(["pending", "accepted", "declined", "expired"]),
  createdAt: z.date(),
  expiresAt: z.date(),
  acceptedAt: z.date().nullable(),
});

export type HouseholdInvitation = z.infer<typeof HouseholdInvitation>;

// Schema for creating a new invitation
export const createHouseholdInvitationInput = z.object({
  householdId: z.string().uuid(),
  invitedEmail: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
});

// Schema for client-side form (without householdId since it's passed separately)
export const createHouseholdInvitationForm = z.object({
  email: z.string().email(),
});

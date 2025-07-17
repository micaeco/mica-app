import { z } from "zod";

export const HouseholdUser = z.object({
  householdId: z.string(),
  userId: z.string(),
  role: z.enum(["admin", "member"]),
});

export type HouseholdUser = z.infer<typeof HouseholdUser>;

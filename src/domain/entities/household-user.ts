import { z } from "zod";

export const HouseholdUser = z.object({
  householdId: z.string(),
  userId: z.string(),
  role: z.string(),
});

export type HouseholdUser = z.infer<typeof HouseholdUser>;

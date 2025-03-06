import { z } from "zod";

import { Household } from "@core/entities/household";
import { User } from "@core/entities/user";

export const HouseholdUser = z.object({
  household: Household,
  user: User,
  role: z.enum(["admin", "member"]),
});

export type HouseholdUser = z.infer<typeof HouseholdUser>;

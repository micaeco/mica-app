import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  emailVerified: z.boolean(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;

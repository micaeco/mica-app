import { z } from "zod";

export const User = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
});

export type User = z.infer<typeof User>;

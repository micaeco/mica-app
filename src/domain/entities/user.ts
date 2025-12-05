import type { auth } from "@adapters/auth";

export type User = typeof auth.$Infer.Session.user;

// Note: For use within auth config callbacks (due to circular reference),
// we need to manually define the type. This is used in @adapters/auth/index.ts
export interface UserForAuthConfig {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  locale: string;
}

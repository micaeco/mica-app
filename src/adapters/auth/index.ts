import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@infrastructure/db/db";
import { sendEmail } from "@infrastructure/services/email.ses";
import { env } from "env";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
      console.log(`Password reset email sent to ${user.email}`);
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  accountLinking: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
      console.log(`Verification email sent to ${user.email}`);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    redirectUrl: "/account",
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

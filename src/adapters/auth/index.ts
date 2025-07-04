import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getMessages } from "next-intl/server";

import ResetPasswordEmail from "@app/_components/emails/reset-password";
import VerificationEmail from "@app/_components/emails/verification";
import { db } from "@infrastructure/db/db";
import { sendEmail } from "@infrastructure/services/email.ses";
import { env } from "env";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
  locale: string;
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      const messages = (await getMessages({
        locale: (user as User).locale,
      })) as unknown as IntlMessages;

      await sendEmail({
        to: user.email,
        subject: messages.emails.resetPassword.title,
        text: await render(
          ResetPasswordEmail({
            messages,
            locale: (user as User).locale || "en",
            resetUrl: url,
          }),
          {
            plainText: true,
          }
        ),
        htmlBody: await render(
          ResetPasswordEmail({
            messages,
            locale: (user as User).locale || "en",
            resetUrl: url,
          }),
          {
            pretty: true,
          }
        ),
      });
      console.log(`Password reset email sent to ${user.email}`);
    },
  },
  user: {
    additionalFields: {
      locale: {
        type: "string",
        required: true,
      },
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
      const messages = (await getMessages({
        locale: (user as User).locale,
      })) as unknown as IntlMessages;

      await sendEmail({
        to: user.email,
        subject: messages.emails.verification.title,
        text: await render(
          VerificationEmail({
            messages,
            locale: (user as User).locale || "en",
            verificationUrl: url,
          }),
          {
            plainText: true,
          }
        ),
        htmlBody: await render(
          VerificationEmail({
            messages,
            locale: (user as User).locale || "en",
            verificationUrl: url,
          }),
          {
            pretty: true,
          }
        ),
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

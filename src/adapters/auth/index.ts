import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getMessages } from "next-intl/server";

import ResetPasswordEmail from "@app/_components/emails/reset-password";
import VerificationEmail from "@app/_components/emails/verification";
import { defaultLocale } from "@app/_i18n/routing";
import { UserForAuthConfig } from "@domain/entities/user";
import { env } from "@env";
import { db } from "@infrastructure/db";
import { SESEmailService } from "@infrastructure/services/email.ses";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      const messages = (await getMessages({
        locale: (user as UserForAuthConfig).locale || defaultLocale,
      })) as unknown as IntlMessages;

      const emailService = new SESEmailService();

      await emailService.sendEmail({
        to: user.email,
        subject: messages.emails.resetPassword.title,
        text: await render(
          ResetPasswordEmail({
            messages,
            locale: (user as UserForAuthConfig).locale || defaultLocale,
            resetUrl: url,
          }),
          {
            plainText: true,
          }
        ),
        html: await render(
          ResetPasswordEmail({
            messages,
            locale: (user as UserForAuthConfig).locale || defaultLocale,
            resetUrl: url,
          }),
          {
            pretty: true,
          }
        ),
      });
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
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60 * 24,
    disableSessionRefresh: false,
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
        locale: (user as UserForAuthConfig).locale || defaultLocale,
      })) as unknown as IntlMessages;

      const emailService = new SESEmailService();

      await emailService.sendEmail({
        to: user.email,
        subject: messages.emails.verification.title,
        text: await render(
          VerificationEmail({
            messages,
            locale: (user as UserForAuthConfig).locale || defaultLocale,
            verificationUrl: url,
          }),
          {
            plainText: true,
          }
        ),
        html: await render(
          VerificationEmail({
            messages,
            locale: (user as UserForAuthConfig).locale || defaultLocale,
            verificationUrl: url,
          }),
          {
            pretty: true,
          }
        ),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

import { Button, Container, Hr, Link, Section, Text } from "@react-email/components";
import { createTranslator } from "next-intl";

import Layout from "@app/_components/emails/layout";
import en from "@app/_messages/en.json";

interface Props {
  messages?: IntlMessages;
  locale?: string;
  resetUrl?: string;
}

export default function ResetPasswordEmail({ messages = en, locale = "en", resetUrl }: Props) {
  const t = createTranslator({ messages, locale });

  return (
    <Layout lang={locale} className="bg-gray-100 py-10">
      <Container className="max-w-xl rounded-md bg-white p-10 shadow-sm">
        {/* Header */}
        <Text className="mb-8 text-center text-2xl font-semibold">
          {t("emails.resetPassword.title")}
        </Text>

        {/* Content */}
        <Text className="mb-4">{t("emails.resetPassword.greeting")}</Text>
        <Text className="mb-4">{t("emails.resetPassword.instruction")}</Text>
        <Text className="mb-4">{t("emails.resetPassword.buttonInstruction")}</Text>

        {/* Button */}
        <Section className="text-center">
          <Button href={resetUrl} className="bg-brand-quaternary rounded-md px-6 py-4 text-zinc-50">
            {t("emails.resetPassword.button")}
          </Button>
        </Section>

        {/* Important Section */}
        <Section className="my-6">
          <Text className="mb-4">
            <strong>{t("emails.resetPassword.important")}</strong>
          </Text>
          <Text className="mb-4">{t("emails.resetPassword.fallback")}</Text>
          <Link href={resetUrl}>{resetUrl}</Link>
        </Section>

        {/* Signature */}
        <Text className="mb-4">
          {t("emails.resetPassword.regards")}
          <br />
          {t("emails.resetPassword.teamSignature")}
        </Text>

        {/* Footer */}
        <Hr className="my-8" />
        <Text className="text-center text-sm text-gray-500">
          {t("emails.resetPassword.automaticNote")}
        </Text>
      </Container>
    </Layout>
  );
}

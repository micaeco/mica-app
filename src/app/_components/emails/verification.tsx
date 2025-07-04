import { Button, Container, Hr, Link, Section, Text } from "@react-email/components";
import { createTranslator } from "next-intl";

import Layout from "@app/_components/emails/layout";
import en from "@app/_messages/en.json";

interface Props {
  messages: IntlMessages;
  locale: string;
  verificationUrl?: string;
}

export default function VerificationEmail({
  messages = en,
  locale = "en",
  verificationUrl,
}: Props) {
  const t = createTranslator({ messages, locale });

  return (
    <Layout lang={locale} className="bg-gray-100 py-10">
      <Container className="max-w-xl rounded-md bg-white p-10 shadow-sm">
        {/* Header */}
        <Text className="mb-8 text-center text-2xl font-semibold">
          {t("emails.verification.title")}
        </Text>

        {/* Content */}
        <Text className="mb-4">{t("emails.verification.greeting")}</Text>
        <Text className="mb-4">{t("emails.verification.thankYou")}</Text>
        <Text className="mb-4">{t("emails.verification.instruction")}</Text>

        {/* Button */}
        <Section className="text-center">
          <Button
            href={verificationUrl}
            className="bg-brand-quaternary rounded-md px-6 py-4 text-zinc-50"
          >
            {t("emails.verification.button")}
          </Button>
        </Section>

        {/* Important Section */}
        <Section className="my-6">
          <Text className="mb-4">
            <strong>{t("emails.verification.important")}</strong>
          </Text>
          <Text className="mb-4">{t("emails.verification.fallback")}</Text>
          <Link href={verificationUrl}>{verificationUrl}</Link>
        </Section>

        {/* Signature */}
        <Text className="mb-4">
          {t("emails.verification.regards")}
          <br />
          {t("emails.verification.teamSignature")}
        </Text>

        {/* Footer */}
        <Hr className="my-8" />
        <Text className="text-center text-sm text-gray-500">
          {t("emails.verification.automaticNote")}
        </Text>
      </Container>
    </Layout>
  );
}

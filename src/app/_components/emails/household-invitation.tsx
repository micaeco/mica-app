import { Button, Container, Hr, Link, Section, Text } from "@react-email/components";
import { createTranslator } from "next-intl";

import Layout from "@app/_components/emails/layout";
import en from "@app/_messages/en.json";

interface Props {
  messages?: IntlMessages;
  locale?: string;
  joinUrl?: string;
  inviterName?: string;
  householdName?: string;
}

export default function HouseholdInvitationEmail({
  messages = en,
  locale = "en",
  joinUrl,
  inviterName = "Someone",
  householdName = "their",
}: Props) {
  const t = createTranslator({ messages, locale });

  return (
    <Layout lang={locale} className="bg-gray-100 py-10">
      <Container className="max-w-xl rounded-md bg-white p-10 shadow-sm">
        {/* Header */}
        <Text className="mb-8 text-center text-2xl font-semibold">
          {t("emails.householdInvitation.title")}
        </Text>

        {/* Content */}
        <Text className="mb-4">{t("emails.householdInvitation.greeting")}</Text>
        <Text className="mb-4">
          {t("emails.householdInvitation.invitation", { inviterName, householdName })}
        </Text>
        <Text className="mb-4">{t("emails.householdInvitation.instruction")}</Text>

        {/* Button */}
        <Section className="text-center">
          <Button href={joinUrl} className="bg-brand-quaternary rounded-md px-6 py-4 text-zinc-50">
            {t("emails.householdInvitation.button")}
          </Button>
        </Section>

        {/* Important Section */}
        <Section className="my-6">
          <Text className="mb-4">
            <strong>{t("emails.householdInvitation.important")}</strong>
          </Text>
          <Text className="mb-4">{t("emails.householdInvitation.fallback")}</Text>
          <Link href={joinUrl}>{joinUrl}</Link>
        </Section>

        {/* Signature */}
        <Text className="mb-4">
          {t("emails.householdInvitation.regards")}
          <br />
          {t("emails.householdInvitation.teamSignature")}
        </Text>

        {/* Footer */}
        <Hr className="my-8" />
        <Text className="text-center text-sm text-gray-500">
          {t("emails.householdInvitation.automaticNote")}
        </Text>
      </Container>
    </Layout>
  );
}

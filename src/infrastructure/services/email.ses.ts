import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import { env } from "@env";

const ses = new SESClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  htmlBody,
}: {
  to: string;
  subject: string;
  text: string;
  htmlBody?: string;
}) {
  const command = new SendEmailCommand({
    Source: "noreply@mica.eco",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: htmlBody },
        Text: { Data: text },
      },
    },
  });

  try {
    const result = await ses.send(command);
    return result;
  } catch (error) {
    throw error;
  }
}

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import { EmailService } from "@domain/services/email";
import { env } from "@env";

const ses = new SESClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class SESEmailService implements EmailService {
  async sendEmail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void> {
    const command = new SendEmailCommand({
      Source: "noreply@mica.eco",
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: html },
          Text: { Data: text },
        },
      },
    });

    try {
      await ses.send(command);
    } catch (error) {
      throw error;
    }
  }
}

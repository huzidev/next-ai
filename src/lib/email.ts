import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailValues {
  to: string;
  subject: string;
  html: string;
}

async function sendErrorEmail(error: unknown) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "huzaifa.iqdev@gmail.com",
    subject: "Email Sending Error Alert 🚨",
    html: `<p><strong>Error:</strong> ${
      error instanceof Error ? error.message : "Unknown error occurred"
    }</p>`,
  });
}

export async function sendEmail(values: EmailValues): Promise<boolean> {
  try {
    const { to, subject, html } = values;
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject,
      html,
    });

    console.log("SW what is response for send email", response);

    return response ? true : false;
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    await sendErrorEmail(error);
    return false;
  }
}
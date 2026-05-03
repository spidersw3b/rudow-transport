import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export function getResend() {
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

export async function sendDispatchEmail(params: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = getResend();
  const to = process.env.DISPATCH_EMAIL || "dispatch@rudowtransportation.net";
  const from = process.env.DISPATCH_EMAIL || "dispatch@rudowtransportation.net";
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY not set; skipping email send");
    return { skipped: true as const };
  }
  const { data, error } = await resend.emails.send({
    from: `Rudow Transportation <${from}>`,
    to: [to],
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { id: data?.id };
}

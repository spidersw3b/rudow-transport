import { NextResponse } from "next/server";
import { z } from "zod";
import { sendDispatchEmail } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  serviceNeeded: z.string().min(1),
  origin: z.string().optional(),
  destination: z.string().optional(),
  message: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    const html = `
      <h2>Website contact — Talk To A Pro</h2>
      <p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(d.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(d.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(d.company || "—")}</p>
      <p><strong>Service:</strong> ${escapeHtml(d.serviceNeeded)}</p>
      <p><strong>Origin:</strong> ${escapeHtml(d.origin || "—")}</p>
      <p><strong>Destination:</strong> ${escapeHtml(d.destination || "—")}</p>
      <p><strong>Instructions:</strong><br/>${escapeHtml(d.message || "—")}</p>
      ${d.photoUrl ? `<p><strong>Photo:</strong> <a href="${escapeHtml(d.photoUrl)}">View</a></p>` : ""}
    `;

    await sendDispatchEmail({
      subject: `Contact: ${d.serviceNeeded} — ${d.name}`,
      html,
      replyTo: d.email,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { generateTransportRequestId } from "@/lib/request-id";
import { sendDispatchEmail } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  customer_email: z.string().email(),
  customer_name: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_type: z.string().min(1),
  vehicle_description: z.string().optional(),
  origin_location: z.string().optional(),
  destination: z.string().optional(),
  special_instructions: z.string().optional(),
  photo_url: z.string().url().optional().nullable(),
  customer_notes: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const role = session.user.role;

    if (role === "admin") {
      const { data, error } = await supabase
        .from("transport_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ requests: data ?? [] });
    }

    const { data, error } = await supabase
      .from("transport_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ requests: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const request_id = await generateTransportRequestId(supabase);
    const user_id = session?.user?.id ?? null;

    const row = {
      request_id,
      user_id,
      customer_email: parsed.data.customer_email,
      customer_name: parsed.data.customer_name ?? null,
      phone: parsed.data.phone ?? null,
      company: parsed.data.company ?? null,
      service_type: parsed.data.service_type,
      vehicle_description: parsed.data.vehicle_description ?? null,
      origin_location: parsed.data.origin_location ?? null,
      destination: parsed.data.destination ?? null,
      special_instructions: parsed.data.special_instructions ?? null,
      photo_url: parsed.data.photo_url ?? null,
      customer_notes: parsed.data.customer_notes ?? null,
      status: "Pending",
      priority: "Medium",
    };

    const { data, error } = await supabase
      .from("transport_requests")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const html = `
      <h2>New transport request ${request_id}</h2>
      <p><strong>Email:</strong> ${parsed.data.customer_email}</p>
      <p><strong>Name:</strong> ${parsed.data.customer_name || "—"}</p>
      <p><strong>Service:</strong> ${parsed.data.service_type}</p>
      <p><strong>Origin:</strong> ${parsed.data.origin_location || "—"}</p>
      <p><strong>Destination:</strong> ${parsed.data.destination || "—"}</p>
      <p><strong>Notes:</strong> ${parsed.data.special_instructions || "—"}</p>
    `;

    try {
      await sendDispatchEmail({
        subject: `New request ${request_id}`,
        html,
        replyTo: parsed.data.customer_email,
      });
    } catch {
      /* email optional in dev */
    }

    return NextResponse.json({ request: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

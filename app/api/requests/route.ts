import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { generateTransportRequestId } from "@/lib/request-id";
import { sendDispatchEmail } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";

const createSchema = z.object({
  customer_email: z.string().email("Provide a valid email."),
  customer_name: z.string().min(1, "Name is required."),
  phone: z.string().min(1, "Phone is required."),
  company: z.string().optional().nullable(),
  service_type: z.string().min(1),
  vehicle_description: z.string().optional().nullable(),
  origin_location: z.string().min(1),
  destination: z.string().min(1),
  special_instructions: z.string().min(1),
  photo_url: z.string().url().optional().nullable(),
  customer_notes: z.string().optional().nullable(),
  priority: z.enum(["Standard", "Expedited", "Flexible"]).optional(),
  request_metadata: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiError(401, "UNAUTHORIZED", "Authentication required.");
    }

    const supabase = getSupabaseAdmin();
    const role = session.user.role;

    if (role === "admin" || role === "super_admin") {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      const mapped = mapSupabaseError(error);
      if (mapped) return mapped;
      return apiOk({ requests: data ?? [] });
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    return apiOk({ requests: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "REQUESTS_GET_FAILED", message);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
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
      special_instructions: parsed.data.special_instructions,
      photo_url: parsed.data.photo_url ?? null,
      customer_notes: parsed.data.customer_notes ?? null,
      status: "Pending",
      priority: parsed.data.priority ?? "Standard",
      request_metadata: parsed.data.request_metadata ?? {},
    };

    const { data, error } = await supabase
      .from("requests")
      .insert(row)
      .select("*")
      .single();

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;

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

    return apiOk({ request: data }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "REQUEST_CREATE_FAILED", message);
  }
}

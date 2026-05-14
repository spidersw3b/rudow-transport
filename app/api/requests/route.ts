import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { generateTransportRequestId } from "@/lib/request-id";
import { sendDispatchEmail } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";

const wizardCreateSchema = z.object({
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

const simpleCreateSchema = z.object({
  quote_channel: z.literal("simple"),
  customer_email: z.string().email("Provide a valid email."),
  customer_name: z.string().min(1, "Name is required."),
  phone: z.string().min(1, "Phone is required."),
  company: z.string().optional().nullable(),
  service_interest: z.string().optional().nullable(),
  project_description: z.string().min(1, "Project description is required."),
  start_date: z.string().optional().nullable(),
  file_urls: z.array(z.string().url()).optional(),
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
    const isSimple = body?.quote_channel === "simple";
    const parsed = isSimple ? simpleCreateSchema.safeParse(body) : wizardCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
    }

    const supabase = getSupabaseAdmin();
    const request_id = await generateTransportRequestId(supabase);
    const user_id = session?.user?.id ?? null;

    const row = isSimple
        ? (() => {
            const d = parsed.data as z.infer<typeof simpleCreateSchema>;
            const fileUrls = d.file_urls ?? [];
            const serviceLabel = d.service_interest?.trim() || "General inquiry";
            const meta = {
              ...(d.request_metadata ?? {}),
              quote_form_variant: "simple",
              file_urls: fileUrls,
              desired_start_date: d.start_date ?? null,
              service_interest: d.service_interest ?? null,
            };
            return {
              request_id,
              user_id,
              customer_email: d.customer_email,
              customer_name: d.customer_name ?? null,
              phone: d.phone ?? null,
              company: d.company ?? null,
              service_type: serviceLabel,
              vehicle_description: null,
              origin_location: "Route TBD — see project description",
              destination: "Route TBD — see project description",
              special_instructions: d.project_description,
              photo_url: fileUrls[0] ?? null,
              customer_notes: null,
              status: "Pending",
              priority: d.priority ?? "Standard",
              request_metadata: meta,
            };
          })()
        : (() => {
            const d = parsed.data as z.infer<typeof wizardCreateSchema>;
            return {
              request_id,
              user_id,
              customer_email: d.customer_email,
              customer_name: d.customer_name ?? null,
              phone: d.phone ?? null,
              company: d.company ?? null,
              service_type: d.service_type,
              vehicle_description: d.vehicle_description ?? null,
              origin_location: d.origin_location ?? null,
              destination: d.destination ?? null,
              special_instructions: d.special_instructions,
              photo_url: d.photo_url ?? null,
              customer_notes: d.customer_notes ?? null,
              status: "Pending",
              priority: d.priority ?? "Standard",
              request_metadata: d.request_metadata ?? {},
            };
          })();

    const { data, error } = await supabase
      .from("requests")
      .insert(row)
      .select("*")
      .single();

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;

    const html = isSimple
      ? `
      <h2>New transport request ${request_id} (Rudow simple quote)</h2>
      <p><strong>Email:</strong> ${(parsed.data as z.infer<typeof simpleCreateSchema>).customer_email}</p>
      <p><strong>Name:</strong> ${(parsed.data as z.infer<typeof simpleCreateSchema>).customer_name || "—"}</p>
      <p><strong>Service interest:</strong> ${(parsed.data as z.infer<typeof simpleCreateSchema>).service_interest || "—"}</p>
      <p><strong>Desired start:</strong> ${(parsed.data as z.infer<typeof simpleCreateSchema>).start_date || "—"}</p>
      <p><strong>Project description:</strong> ${(parsed.data as z.infer<typeof simpleCreateSchema>).project_description || "—"}</p>
      <p><strong>Attachments:</strong> ${((parsed.data as z.infer<typeof simpleCreateSchema>).file_urls ?? []).join(", ") || "—"}</p>
    `
      : `
      <h2>New transport request ${request_id}</h2>
      <p><strong>Email:</strong> ${(parsed.data as z.infer<typeof wizardCreateSchema>).customer_email}</p>
      <p><strong>Name:</strong> ${(parsed.data as z.infer<typeof wizardCreateSchema>).customer_name || "—"}</p>
      <p><strong>Service:</strong> ${(parsed.data as z.infer<typeof wizardCreateSchema>).service_type}</p>
      <p><strong>Origin:</strong> ${(parsed.data as z.infer<typeof wizardCreateSchema>).origin_location || "—"}</p>
      <p><strong>Destination:</strong> ${(parsed.data as z.infer<typeof wizardCreateSchema>).destination || "—"}</p>
      <p><strong>Notes:</strong> ${(parsed.data as z.infer<typeof wizardCreateSchema>).special_instructions || "—"}</p>
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

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";

const updateSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  tracking_number: z.string().optional().nullable(),
  driver_assigned: z.string().optional().nullable(),
  estimated_completion: z.string().optional().nullable(),
  origin_location: z.string().optional().nullable(),
  destination: z.string().optional().nullable(),
  customer_notes: z.string().optional().nullable(),
  admin_notes: z.string().optional().nullable(),
  request_metadata: z.record(z.any()).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiError(401, "UNAUTHORIZED", "Authentication required.");
    }

    const { id } = params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    if (!data) return apiError(404, "NOT_FOUND", "Request not found.");

    if (session.user.role !== "admin" && data.user_id !== session.user.id) {
      return apiError(403, "FORBIDDEN", "You do not have access to this request.");
    }

    return apiOk({ request: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "REQUEST_GET_FAILED", message);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      return apiError(403, "FORBIDDEN", "Only admins can update requests.");
    }

    const { id } = params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
    }

    const supabase = getSupabaseAdmin();
    const updates = { ...parsed.data, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from("requests")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;

    return apiOk({ request: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "REQUEST_UPDATE_FAILED", message);
  }
}

import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const updateSchema = z.object({
  driver_id: z.string().uuid().optional().nullable(),
  pickup_scheduled_at: z.string().optional().nullable(),
  delivery_scheduled_at: z.string().optional().nullable(),
  pickup_location: z.string().optional(),
  delivery_location: z.string().optional(),
  status: z.enum(["Planned", "Dispatched", "In Transit", "Delivered", "Delayed", "Cancelled"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can update shipments.");
  }
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transport_shipments")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ shipment: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can delete shipments.");
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("transport_shipments").delete().eq("id", params.id);
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ ok: true });
}

import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const updateSchema = z.object({
  pickup_eta: z.string().optional().nullable(),
  delivery_eta: z.string().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
  proof_document_url: z.string().url().optional().nullable(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can update deliveries.");
  }
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("driver_deliveries")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ delivery: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can delete deliveries.");
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("driver_deliveries").delete().eq("id", params.id);
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ ok: true });
}

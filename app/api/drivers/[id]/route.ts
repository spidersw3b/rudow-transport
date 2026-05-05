import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  license_number: z.string().optional().nullable(),
  license_expiry: z.string().optional().nullable(),
  status: z.string().optional(),
  availability_status: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can update drivers.");
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("drivers").update(parsed.data).eq("id", params.id).select("*").single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ driver: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can delete drivers.");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("drivers").delete().eq("id", params.id);
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ ok: true });
}

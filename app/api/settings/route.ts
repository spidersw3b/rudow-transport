import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const updateSchema = z.object({
  key: z.string().min(1),
  value: z.record(z.any()),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can read settings.");
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("admin_settings").select("*").order("updated_at", { ascending: false });
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ settings: data ?? [] });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only super admins can update settings.");
  }
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_settings")
    .upsert(
      { key: parsed.data.key, value: parsed.data.value, updated_by: session.user.id },
      { onConflict: "key" }
    )
    .select("*")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ setting: data });
}

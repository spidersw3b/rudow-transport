import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  report_month: z.string().min(1),
  summary: z.string().min(1),
  generated_by: z.string().optional().nullable(),
  payload: z.record(z.any()).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can view reports.");
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("report_history").select("*").order("created_at", { ascending: false });
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ reports: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can generate reports.");
  }
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("report_history")
    .insert({ ...parsed.data, generated_by: parsed.data.generated_by ?? session.user.email ?? null })
    .select("*")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ report: data }, { status: 201 });
}

import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  request_id: z.string().uuid(),
  submitted_by_user_id: z.string().uuid().optional().nullable(),
  role_scope: z.enum(["customer", "admin"]).optional(),
  file_url: z.string().url(),
  file_name: z.string().min(1),
  status: z.enum(["Pending", "Reviewed", "Rejected"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Authentication required.");
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("request_id");
  let query = supabase.from("document_submissions").select("*").order("created_at", { ascending: false });
  if (requestId) query = query.eq("request_id", requestId);
  if (session.user.role === "customer") query = query.eq("submitted_by_user_id", session.user.id);
  const { data, error } = await query;
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ documents: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Authentication required.");
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const payload = {
    ...parsed.data,
    submitted_by_user_id: parsed.data.submitted_by_user_id ?? session.user.id,
    role_scope: parsed.data.role_scope ?? (session.user.role === "customer" ? "customer" : "admin"),
    status: parsed.data.status ?? "Pending",
  };
  const { data, error } = await supabase.from("document_submissions").insert(payload).select("*").single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ document: data }, { status: 201 });
}

import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const updateSchema = z.object({
  status: z.enum(["Pending", "Reviewed", "Rejected"]),
  notes: z.string().optional().nullable(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can update document statuses.");
  }
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("document_submissions")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ document: data });
}

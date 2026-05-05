import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.enum(["customer", "admin", "super_admin"]).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Authentication required.");
  if (session.user.role === "customer" && session.user.id !== params.id) {
    return apiError(403, "FORBIDDEN", "Customers can only view their own profile.");
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("id,email,name,company,phone,role,created_at")
    .eq("id", params.id)
    .maybeSingle();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  if (!data) return apiError(404, "NOT_FOUND", "User not found.");
  return apiOk({ user: data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Authentication required.");
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  if (session.user.role === "customer" && session.user.id !== params.id) {
    return apiError(403, "FORBIDDEN", "Customers can only update their own profile.");
  }
  if (parsed.data.role && session.user.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only super admins can change roles.");
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .update(parsed.data)
    .eq("id", params.id)
    .select("id,email,name,company,phone,role,created_at")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ user: data });
}

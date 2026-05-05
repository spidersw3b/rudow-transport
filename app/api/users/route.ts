import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  company: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.enum(["customer", "admin", "super_admin"]),
  password: z.string().min(8),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can list users.");
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("id,email,name,company,phone,role,created_at")
    .order("created_at", { ascending: false });
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ users: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only super admins can create users.");
  }
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const password_hash = await bcrypt.hash(parsed.data.password, 12);
  const { data, error } = await supabase
    .from("users")
    .insert({ ...parsed.data, password_hash })
    .select("id,email,name,company,phone,role,created_at")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ user: data }, { status: 201 });
}

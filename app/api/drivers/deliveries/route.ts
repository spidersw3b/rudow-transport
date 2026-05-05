import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  driver_id: z.string().uuid(),
  request_id: z.string().uuid().optional().nullable(),
  transport_shipment_id: z.string().uuid().optional().nullable(),
  pickup_eta: z.string().optional().nullable(),
  delivery_eta: z.string().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can view deliveries.");
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("driver_deliveries")
    .select("*, drivers(id,name,status), requests(id,request_id,status)")
    .order("created_at", { ascending: false });
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ deliveries: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can create deliveries.");
  }
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("driver_deliveries").insert(parsed.data).select("*").single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ delivery: data }, { status: 201 });
}

import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  request_id: z.string().uuid(),
  driver_id: z.string().uuid().optional().nullable(),
  pickup_scheduled_at: z.string().optional().nullable(),
  delivery_scheduled_at: z.string().optional().nullable(),
  pickup_location: z.string().min(1),
  delivery_location: z.string().min(1),
  status: z.enum(["Planned", "Dispatched", "In Transit", "Delivered", "Delayed", "Cancelled"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Authentication required.");
  const supabase = getSupabaseAdmin();
  if (session.user.role === "admin" || session.user.role === "super_admin") {
    const { data, error } = await supabase
      .from("transport_shipments")
      .select("*, requests(id,request_id,customer_email,status), drivers(id,name,status)")
      .order("created_at", { ascending: false });
    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    return apiOk({ shipments: data ?? [] });
  }
  const { data, error } = await supabase
    .from("transport_shipments")
    .select("*, requests!inner(id,request_id,user_id,customer_email,status)")
    .eq("requests.user_id", session.user.id)
    .order("created_at", { ascending: false });
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ shipments: data ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
    return apiError(403, "FORBIDDEN", "Only admins can create shipments.");
  }
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transport_shipments")
    .insert({
      ...parsed.data,
      status: parsed.data.status ?? "Planned",
    })
    .select("*")
    .single();
  const mapped = mapSupabaseError(error);
  if (mapped) return mapped;
  return apiOk({ shipment: data }, { status: 201 });
}

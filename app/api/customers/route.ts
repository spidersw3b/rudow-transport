import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      return apiError(403, "FORBIDDEN", "Only admins can list customers.");
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, company, phone, role, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    const customerIds = (data ?? []).map((customer) => customer.id);
    const counts = customerIds.length
      ? await supabase
          .from("requests")
          .select("user_id")
          .in("user_id", customerIds)
      : { data: [], error: null };
    const countsMapped = mapSupabaseError(counts.error);
    if (countsMapped) return countsMapped;
    const countMap = new Map<string, number>();
    (counts.data ?? []).forEach((row) => {
      if (!row.user_id) return;
      countMap.set(row.user_id, (countMap.get(row.user_id) ?? 0) + 1);
    });
    return apiOk({
      customers: (data ?? []).map((customer) => ({
        ...customer,
        request_count: countMap.get(customer.id) ?? 0,
      })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "CUSTOMERS_GET_FAILED", message);
  }
}

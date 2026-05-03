import type { SupabaseClient } from "@supabase/supabase-js";

export async function generateTransportRequestId(
  supabase: SupabaseClient
): Promise<string> {
  const { count, error } = await supabase
    .from("transport_requests")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  const next = (count ?? 0) + 1;
  return `RUD-T-${String(next).padStart(5, "0")}`;
}

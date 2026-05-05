import { apiError } from "@/lib/api-response";

export function mapSupabaseError(error: { code?: string; message?: string } | null) {
  if (!error) return null;
  if (error.code === "42P01") {
    return apiError(
      503,
      "SETUP_REQUIRED",
      "Database tables are missing. Run scripts/supabase-admin-full.sql and retry."
    );
  }
  return apiError(500, "DB_ERROR", error.message ?? "Database operation failed.");
}

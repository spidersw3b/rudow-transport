import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const VARIANT_KEY = "quote_form_variant";

function normalizeVariant(value: string | null | undefined): "simple" | "multi-step" {
  return value === "multi-step" ? "multi-step" : "simple";
}

/** Rudow Automotive — public read of which /quote form variant is active. */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("rudow_site_settings").select("value").eq("key", VARIANT_KEY).maybeSingle();
    if (error) {
      return apiOk({ variant: "simple" as const });
    }
    return apiOk({ variant: normalizeVariant(data?.value) });
  } catch {
    return apiOk({ variant: "simple" as const });
  }
}

const putSchema = z.object({
  variant: z.enum(["simple", "multi-step"]),
});

/** Rudow Automotive admin: persist quote form variant (`rudow_site_settings`). */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      return apiError(403, "FORBIDDEN", "Only admins can update quote form settings.");
    }
    const parsed = putSchema.safeParse(await req.json());
    if (!parsed.success) {
      return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("rudow_site_settings").upsert(
      { key: VARIANT_KEY, value: parsed.data.variant, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    return apiOk({ variant: parsed.data.variant });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "QUOTE_FORM_VARIANT_UPDATE_FAILED", message);
  }
}

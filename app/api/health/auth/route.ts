import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/health/auth — which auth-related env vars are set (no secret values).
 * GET /api/health/auth?probe=1 — also runs one Supabase read on `users` (service role).
 */
export async function GET(req: Request) {
  const probe = new URL(req.url).searchParams.get("probe") === "1";

  const env = {
    NEXTAUTH_URL: Boolean(process.env.NEXTAUTH_URL?.trim()),
    NEXTAUTH_OR_AUTH_SECRET: Boolean(
      (process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET)?.trim()
    ),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  };

  let supabaseUsersProbe: { ok: boolean; hint?: string } | undefined;

  if (probe) {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      supabaseUsersProbe = {
        ok: false,
        hint: "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy.",
      };
    } else {
      try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.from("users").select("id").limit(1);
        if (error) {
          supabaseUsersProbe = {
            ok: false,
            hint: `${error.code ?? "error"}: ${error.message}`,
          };
        } else {
          supabaseUsersProbe = { ok: true };
        }
      } catch (e) {
        supabaseUsersProbe = {
          ok: false,
          hint: e instanceof Error ? e.message : "Unknown error",
        };
      }
    }
  }

  return NextResponse.json({ ok: true, env, supabaseUsersProbe });
}

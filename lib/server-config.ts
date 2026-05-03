/**
 * Shared server-side checks for auth + Supabase (Vercel env, local .env).
 * Keep in sync with middleware and NextAuth options.
 */

export function getNextAuthSecret(): string | undefined {
  const s =
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim();
  return s || undefined;
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

/** Human-readable checklist for operators (shown in UI + health JSON). */
export function getAuthEnvIssues(): string[] {
  const issues: string[] = [];
  if (!getNextAuthSecret()) {
    issues.push(
      "Set NEXTAUTH_SECRET (run: openssl rand -base64 32) or AUTH_SECRET — required for sign-in."
    );
  }
  if (!process.env.NEXTAUTH_URL?.trim()) {
    issues.push(
      "Set NEXTAUTH_URL to your full public site URL (e.g. https://your-project.vercel.app)."
    );
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    issues.push("Set NEXT_PUBLIC_SUPABASE_URL from Supabase → Project Settings → API.");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    issues.push(
      "Set SUPABASE_SERVICE_ROLE_KEY (service_role key from Supabase — not the anon key)."
    );
  }
  return issues;
}

export const SUPABASE_UNAVAILABLE_MESSAGE =
  "Account sign-up is unavailable until the database is connected. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your deployment environment (e.g. Vercel), then redeploy.";

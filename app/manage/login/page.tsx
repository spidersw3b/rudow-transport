"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { RudowTransportLogo } from "@/components/layout/RudowTransportLogo";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/manage";
  const err = search.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error || res?.ok === false) {
      setError("Invalid email or password.");
      return;
    }
    // App Router: refresh so the session cookie is visible to getSession().
    router.refresh();
    await new Promise((r) => setTimeout(r, 150));
    const session = await getSession();
    const isAdmin = session?.user?.role === "admin";
    let next = res?.url ?? callbackUrl;
    if (isAdmin) {
      next =
        callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard";
    }
    window.location.href = next;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rt-navy px-4 py-16">
      <div className="w-full max-w-md rounded-sm border border-white/10 bg-white/95 p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <RudowTransportLogo compact className="mx-auto h-10 w-full max-w-[220px]" />
          <p className="mt-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-rt-text-mid">
            Customer and staff sign-in
          </p>
          <p className="mt-2 max-w-sm text-center font-body text-xs text-rt-text-mid">
            Same login for customers and administrators. Admins are sent to the admin console after
            signing in.
          </p>
        </div>
        {err === "AdminOnly" ? (
          <p className="mt-4 rounded-sm bg-badge-orange/15 px-3 py-2 text-center text-sm text-orange-900">
            That area is for administrators only. Sign in below with your{" "}
            <strong>admin email and password</strong> (same page as customers) — you will be routed
            to the admin console automatically.
          </p>
        ) : null}
        {err === "Configuration" ? (
          <p className="mt-4 rounded-sm border border-badge-red/30 bg-badge-red/10 px-3 py-2 text-center text-sm text-red-900">
            Auth is misconfigured: set <strong>NEXTAUTH_SECRET</strong> (e.g.{" "}
            <code className="rounded bg-white/80 px-1">openssl rand -base64 32</code>) and{" "}
            <strong>NEXTAUTH_URL</strong> to your site URL (e.g. <code className="rounded bg-white/80 px-1">https://your-domain.com</code> on Vercel). Then redeploy.
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div>
            <label className="text-xs font-semibold uppercase text-rt-text-mid">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-rt-text-mid">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-rt-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center font-body text-sm text-rt-text-mid">
          New customer?{" "}
          <Link className="font-semibold text-rt-blue hover:underline" href="/manage/signup">
            Create an account →
          </Link>
        </p>
        <p className="mt-2 text-center font-body text-sm text-rt-text-mid">
          Just need a quote?{" "}
          <Link className="font-semibold text-rt-blue hover:underline" href="/contact">
            Submit a request →
          </Link>
        </p>
        <p className="mt-6 border-t border-rt-gray-mid pt-4 text-center font-body text-xs text-rt-text-mid">
          If sign-in always fails, your admin row may be missing in Supabase or env vars may be wrong
          on the server. Open{" "}
          <Link className="font-semibold text-rt-blue hover:underline" href="/api/health/auth?probe=1">
            /api/health/auth?probe=1
          </Link>{" "}
          (JSON) to verify database connectivity, then run the admin seed in{" "}
          <code className="rounded bg-rt-gray/80 px-1">lib/schema.sql</code> or{" "}
          <code className="rounded bg-rt-gray/80 px-1">scripts/seed-brett-admin.sql</code> in the
          Supabase SQL editor.
        </p>
      </div>
    </div>
  );
}

export default function ManageLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-rt-navy" />}>
      <LoginForm />
    </Suspense>
  );
}

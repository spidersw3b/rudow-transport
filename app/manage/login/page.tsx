"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { RudowTransportLogo } from "@/components/layout/RudowTransportLogo";

function LoginForm() {
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
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rt-navy px-4 py-16">
      <div className="w-full max-w-md rounded-sm border border-white/10 bg-white/95 p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <RudowTransportLogo compact className="mx-auto h-10 w-full max-w-[220px]" />
          <p className="mt-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-rt-text-mid">
            Customer portal
          </p>
        </div>
        {err === "AdminOnly" ? (
          <p className="mt-4 rounded-sm bg-badge-orange/15 px-3 py-2 text-center text-sm text-orange-900">
            That area is restricted to administrators. Customer accounts can use the portal after
            signing in here.
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

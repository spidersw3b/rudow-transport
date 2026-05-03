"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { AuthDeploymentBanner } from "@/components/auth/AuthDeploymentBanner";
import { RudowTransportLogo } from "@/components/layout/RudowTransportLogo";

const schema = z
  .object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords must match", path: ["confirm"] });

export default function ManageSignupPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid form");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.code === "SUPABASE_ENV_MISSING" && typeof data?.error === "string"
            ? data.error
            : typeof data?.error === "string"
              ? data.error
              : res.status === 503
                ? "Sign-up is temporarily unavailable (server configuration)."
                : "Signup failed";
        throw new Error(msg);
      }

      const sign = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
        callbackUrl: "/manage",
      });
      if (sign?.error) throw new Error("Auto sign-in failed");
      window.location.href = "/manage";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rt-navy px-4 py-16">
      <div className="w-full max-w-md rounded-sm border border-white/10 bg-white/95 p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <RudowTransportLogo compact className="mx-auto h-10 w-full max-w-[220px]" />
          <p className="mt-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-rt-text-mid">
            Create customer account
          </p>
        </div>
        <AuthDeploymentBanner />
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <input
            required
            placeholder="Full name"
            className="w-full rounded-sm border px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            placeholder="Phone"
            className="w-full rounded-sm border px-3 py-2 text-sm"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-sm border px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            required
            type="password"
            placeholder="Password (min 8)"
            className="w-full rounded-sm border px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <input
            required
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-sm border px-3 py-2 text-sm"
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-rt-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center font-body text-sm text-rt-text-mid">
          Already have an account?{" "}
          <Link className="font-semibold text-rt-blue hover:underline" href="/manage/login">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

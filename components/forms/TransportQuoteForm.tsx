"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SERVICE_OPTIONS } from "@/lib/service-options";

const schema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_type: z.string().min(1),
  vehicle_description: z.string().optional(),
  origin_location: z.string().optional(),
  destination: z.string().optional(),
  special_instructions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function TransportQuoteForm() {
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      phone: "",
      company: "",
      service_type: "",
      vehicle_description: "",
      origin_location: "",
      destination: "",
      special_instructions: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSuccessId(null);
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccessId(data.request?.request_id ?? null);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-4 rounded-sm border border-rt-gray-mid bg-white p-6 shadow-md md:p-8">
      <h2 className="font-display text-2xl font-bold text-rt-navy">Transport quote</h2>
      {successId ? (
        <p className="rounded-sm border border-badge-green/40 bg-badge-green/10 px-4 py-3 text-sm text-green-900">
          ✓ Submitted! Reference: {successId}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-sm border border-badge-red/40 bg-badge-red/10 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Full name *</label>
          <input className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("customer_name")} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Email *</label>
          <input type="email" className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("customer_email")} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Phone</label>
          <input className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("phone")} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Company</label>
          <input className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("company")} />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-rt-text-mid">Service *</label>
        <select className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("service_type")}>
          <option value="">Select…</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-rt-text-mid">Vehicle / load description</label>
        <textarea rows={3} className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("vehicle_description")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Origin</label>
          <input className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("origin_location")} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Destination</label>
          <input className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("destination")} />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-rt-text-mid">Special instructions</label>
        <textarea rows={3} className="mt-1 w-full rounded-sm border px-3 py-2 text-sm" {...form.register("special_instructions")} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-rt-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark disabled:opacity-60"
      >
        {loading ? "Sending…" : "Submit quote"}
      </button>
    </form>
  );
}

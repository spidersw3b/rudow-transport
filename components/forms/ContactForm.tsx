"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SERVICE_OPTIONS } from "@/lib/service-options";

const schema = z.object({
  fullName: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  email: z.string().email(),
  company: z.string().optional(),
  serviceNeeded: z.string().min(1, "Required"),
  origin: z.string().optional(),
  destination: z.string().optional(),
  instructions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      company: "",
      serviceNeeded: "",
      origin: "",
      destination: "",
      instructions: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSuccessId(null);
    setSubmitting(true);
    try {
      let photo_url: string | null = null;
      if (file) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/upload?purpose=quote", { method: "POST", body: fd });
        const uj = await up.json();
        setUploading(false);
        if (!up.ok) throw new Error(uj.error || "Upload failed");
        photo_url = uj.url;
      }

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: values.email,
          customer_name: values.fullName,
          phone: values.phone,
          company: values.company || null,
          service_type: values.serviceNeeded,
          origin_location: values.origin || null,
          destination: values.destination || null,
          special_instructions: values.instructions || null,
          photo_url,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      setSuccessId(data.request?.request_id ?? null);
      form.reset();
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {successId ? (
        <p className="rounded-sm border border-badge-green/40 bg-badge-green/10 px-4 py-3 font-body text-sm text-green-900">
          ✓ Request submitted! Your ID: {successId}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-sm border border-badge-red/40 bg-badge-red/10 px-4 py-3 font-body text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
            Full name *
          </label>
          <input
            className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.fullName.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
            Phone number *
          </label>
          <input
            className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
            {...form.register("phone")}
          />
          {form.formState.errors.phone ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
            Email *
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
            Company
          </label>
          <input
            className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
            {...form.register("company")}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
          Service needed *
        </label>
        <select
          className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
          {...form.register("serviceNeeded")}
        >
          <option value="">Select…</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {form.formState.errors.serviceNeeded ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.serviceNeeded.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
            Origin location
          </label>
          <input
            className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
            {...form.register("origin")}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
            Destination
          </label>
          <input
            className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
            {...form.register("destination")}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
          Special instructions
        </label>
        <textarea
          rows={4}
          className="mt-1 w-full rounded-sm border border-rt-gray-mid px-3 py-2 font-body text-sm outline-none ring-rt-navy focus:ring-2"
          {...form.register("instructions")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rt-text-mid">
          Profile / vehicle photo
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer rounded-sm border-2 border-rt-navy px-4 py-2 font-body text-xs font-bold uppercase tracking-wide text-rt-navy hover:bg-rt-navy hover:text-white">
            + Upload photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="font-body text-xs text-rt-text-mid">Max: 2 MB</span>
          {file ? <span className="font-body text-xs text-rt-navy">{file.name}</span> : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full rounded-sm bg-rt-navy-dark py-3 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-black disabled:opacity-60"
      >
        {uploading ? "Uploading…" : submitting ? "Submitting…" : "Start now"}
      </button>
    </form>
  );
}

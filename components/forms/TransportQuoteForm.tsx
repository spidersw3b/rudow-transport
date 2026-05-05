"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional(),
  role_title: z.string().optional(),
  lead_source: z.string().optional(),
  service_type: z.string().min(1),
  fleet_size: z.string().optional(),
  vehicle_types: z.string().optional(),
  origin_location: z.string().min(1),
  destination: z.string().min(1),
  preferred_pickup_date: z.string().optional(),
  priority: z.enum(["Standard", "Expedited", "Flexible"]),
  budget_range: z.string().optional(),
  special_instructions: z.string().min(1),
  preferred_contact_method: z.string().optional(),
  best_contact_time: z.string().optional(),
  agreement: z.boolean().refine((value) => value, "You must agree before submitting."),
  file_urls: z.array(z.string().url()).optional(),
});

type FormValues = z.infer<typeof schema>;

export function TransportQuoteForm() {
  const [step, setStep] = useState(1);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      customer_name: "",
      customer_email: "",
      phone: "",
      company: "",
      role_title: "",
      lead_source: "",
      service_type: "",
      fleet_size: "",
      vehicle_types: "",
      origin_location: "",
      destination: "",
      preferred_pickup_date: "",
      priority: "Standard",
      budget_range: "",
      special_instructions: "",
      preferred_contact_method: "",
      best_contact_time: "",
      agreement: false,
      file_urls: [],
    },
  });

  const values = form.watch();
  const maxStep = 4;
  const stepTitle = useMemo(
    () =>
      ({
        1: "Contact Info",
        2: "Shipment Details",
        3: "Project Context + Files",
        4: "Review & Submit",
      } as Record<number, string>),
    []
  );

  async function uploadFiles(nextFiles: FileList | null) {
    if (!nextFiles?.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(nextFiles)) {
        const data = new FormData();
        data.append("file", file);
        const response = await fetch("/api/upload?purpose=quote", { method: "POST", body: data });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Upload failed");
        uploaded.push(payload.url);
      }
      setFiles((prev) => [...prev, ...uploaded]);
      form.setValue("file_urls", [...files, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function next() {
    setStep((current) => Math.min(maxStep, current + 1));
  }

  function back() {
    setStep((current) => Math.max(1, current - 1));
  }

  async function onSubmit(values: FormValues) {
    setError(null);
    setSuccessId(null);
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          phone: values.phone,
          company: values.company,
          service_type: values.service_type,
          origin_location: values.origin_location,
          destination: values.destination,
          special_instructions: values.special_instructions,
          priority: values.priority,
          request_metadata: {
            role_title: values.role_title,
            lead_source: values.lead_source,
            fleet_size: values.fleet_size,
            vehicle_types: values.vehicle_types,
            preferred_pickup_date: values.preferred_pickup_date,
            budget_range: values.budget_range,
            preferred_contact_method: values.preferred_contact_method,
            best_contact_time: values.best_contact_time,
            file_urls: files,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || data.error || "Failed");
      setSuccessId(data.request?.request_id ?? null);
      form.reset();
      setFiles([]);
      setStep(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-4 rounded-sm border border-rt-gray-mid bg-white p-6 shadow-md md:p-8">
      <h2 className="font-display text-2xl font-bold text-rt-navy">Transport Quote Wizard</h2>
      <p className="text-sm text-rt-text-mid">
        Step {step} of 4: {stepTitle[step]}
      </p>
      {successId ? (
        <div className="rounded-sm border border-badge-green/40 bg-badge-green/10 p-4 text-sm text-green-900">
          <p className="font-semibold">Submitted successfully. Reference: {successId}</p>
          <div className="mt-3 flex gap-3">
            <Link href="/manage" className="rounded-sm bg-rt-navy px-3 py-2 text-white">
              Go to dashboard
            </Link>
            <Link href="/" className="rounded-sm border border-rt-gray-mid px-3 py-2 text-rt-navy">
              Back to home
            </Link>
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="rounded-sm border border-badge-red/40 bg-badge-red/10 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {step === 1 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Full name*" {...form.register("customer_name")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Email*" type="email" {...form.register("customer_email")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Phone*" {...form.register("phone")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Company" {...form.register("company")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Role/title" {...form.register("role_title")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Lead source" {...form.register("lead_source")} />
              </div>
            </>
          ) : null}
          {step === 2 ? (
            <>
              <input className="w-full rounded-sm border px-3 py-2 text-sm" placeholder="Transport type(s)*" {...form.register("service_type")} />
              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Fleet size bracket" {...form.register("fleet_size")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Vehicle type(s)" {...form.register("vehicle_types")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Pickup location*" {...form.register("origin_location")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Delivery destination*" {...form.register("destination")} />
                <input type="date" className="rounded-sm border px-3 py-2 text-sm" {...form.register("preferred_pickup_date")} />
                <select className="rounded-sm border px-3 py-2 text-sm" {...form.register("priority")}>
                  <option value="Standard">Standard</option>
                  <option value="Expedited">Expedited</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <input className="w-full rounded-sm border px-3 py-2 text-sm" placeholder="Budget range" {...form.register("budget_range")} />
            </>
          ) : null}
          {step === 3 ? (
            <>
              <textarea rows={5} className="w-full rounded-sm border px-3 py-2 text-sm" placeholder="Detailed project description*" {...form.register("special_instructions")} />
              <div className="rounded-sm border border-dashed border-rt-gray-mid p-4">
                <input type="file" accept="image/*,application/pdf" multiple onChange={(event) => void uploadFiles(event.target.files)} />
                <p className="mt-2 text-xs text-rt-text-mid">{uploading ? "Uploading files..." : `${files.length} files attached`}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Preferred contact method" {...form.register("preferred_contact_method")} />
                <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Best time to reach you" {...form.register("best_contact_time")} />
              </div>
            </>
          ) : null}
          {step === 4 ? (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-rt-navy">Review your submission</p>
              <p>Name: {values.customer_name}</p>
              <p>Email: {values.customer_email}</p>
              <p>Transport type: {values.service_type}</p>
              <p>
                Route: {values.origin_location} {"->"} {values.destination}
              </p>
              <p>Description: {values.special_instructions}</p>
              <button type="button" className="text-xs text-rt-blue underline" onClick={() => setStep(1)}>
                Edit contact
              </button>
              <button type="button" className="ml-3 text-xs text-rt-blue underline" onClick={() => setStep(2)}>
                Edit shipment
              </button>
              <div className="pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...form.register("agreement")} />
                  I confirm this request is accurate.
                </label>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
      <button
        type={step === 4 ? "submit" : "button"}
        onClick={step === 4 ? undefined : next}
        disabled={loading || uploading}
        className="w-full rounded-sm bg-rt-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark disabled:opacity-60"
      >
        {step === 4 ? (loading ? "Sending..." : "Submit quote") : "Continue"}
      </button>
      {step > 1 ? (
        <button type="button" onClick={back} className="w-full rounded-sm border border-rt-gray-mid py-3 text-sm font-semibold text-rt-navy">
          Back
        </button>
      ) : null}
    </form>
  );
}

"use client";

/** Rudow Automotive — single-page transport quote for /quote (variant: simple). */
import { AlertCircle, ArrowRight, Camera, CheckCircle, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service…" },
  { value: "transport", label: "Transport" },
  { value: "fleet", label: "Fleet" },
  { value: "dealership", label: "Dealership / OEM" },
  { value: "other", label: "Other / not sure" },
] as const;

const REQUIRED_FIELDS = ["name", "phone", "email", "description"] as const;

const MAX_PHOTOS = 5;
const MAX_PHOTO_MB = 8;

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
};

const phoneRaw = process.env.NEXT_PUBLIC_PHONE || "7708861016";
const phoneDisplay = "770-886-1016";

export function SimpleQuoteForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    service: "",
    description: "",
    startDate: "",
  });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);
  const photosRef = useRef<PhotoItem[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      photosRef.current.forEach((p) => {
        if (p.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
    };
  }, []);

  const handleChange = useCallback((field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.description.trim()) errs.description = "Project description is required";
    return errs;
  }, [form]);

  const stagePhotos = useCallback((fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    setPhotos((prev) => {
      const remaining = MAX_PHOTOS - prev.length;
      if (remaining <= 0) return prev;
      const valid = files
        .filter((f) => {
          if (f.size > MAX_PHOTO_MB * 1024 * 1024) return false;
          if (!f.type.startsWith("image/")) return false;
          return true;
        })
        .slice(0, remaining);
      const newPhotos = valid.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...newPhotos];
    });
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const p = prev.find((ph) => ph.id === id);
      if (p?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(p.previewUrl);
      }
      return prev.filter((ph) => ph.id !== id);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMounted.current) setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMounted.current) setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMounted.current) setDragOver(false);
      stagePhotos(e.dataTransfer?.files ?? null);
    },
    [stagePhotos]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        const firstField = REQUIRED_FIELDS.find((f) => errs[f]);
        if (firstField) {
          document.getElementById(`field-${firstField}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      if (!isMounted.current) return;
      setSubmitting(true);
      setSubmitError(null);

      try {
        const uploadedUrls: string[] = [];
        for (const photo of photos) {
          try {
            const data = new FormData();
            data.append("file", photo.file);
            const response = await fetch("/api/upload?purpose=quote", { method: "POST", body: data });
            const payload = (await response.json()) as { url?: string; error?: string };
            if (!response.ok) throw new Error(payload.error ?? "Upload failed");
            if (payload.url) uploadedUrls.push(payload.url);
          } catch (uploadErr) {
            console.warn("Photo upload failed:", uploadErr instanceof Error ? uploadErr.message : uploadErr);
          }
        }

        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quote_channel: "simple",
            customer_name: form.name.trim(),
            customer_email: form.email.trim(),
            phone: form.phone.trim(),
            company: form.company.trim() || null,
            service_interest: form.service.trim() || null,
            project_description: form.description.trim(),
            start_date: form.startDate || null,
            file_urls: uploadedUrls,
          }),
        });
        const data = (await res.json()) as { request?: { request_id?: string }; error?: { message?: string } | string };
        if (!res.ok) {
          const msg =
            typeof data.error === "object" && data.error?.message
              ? data.error.message
              : typeof data.error === "string"
                ? data.error
                : "Submission failed.";
          throw new Error(msg);
        }

        if (isMounted.current) {
          setRefNumber(data.request?.request_id ?? "");
          setSubmitted(true);
        }
      } catch (err) {
        if (isMounted.current) {
          setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again or call us directly.");
        }
      } finally {
        if (isMounted.current) setSubmitting(false);
      }
    },
    [form, photos, validate]
  );

  const inputClass = (hasError: boolean) =>
    `h-12 w-full rounded-sm border px-3.5 text-sm text-rt-text-dark outline-none transition-colors focus:border-rt-navy ${
      hasError ? "border-badge-red" : "border-rt-gray-mid"
    }`;

  if (submitted) {
    const firstName = form.name.trim().split(/\s+/)[0] ?? "there";
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-badge-green">
          <CheckCircle className="text-white" size={36} strokeWidth={2} aria-hidden />
        </div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-rt-navy">Request received</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-rt-text-mid">
          Thanks, {firstName}. We&apos;ll be in touch within one business day.
        </p>
        {refNumber ? (
          <div className="mt-4 rounded-sm border border-rt-gray-mid bg-rt-gray px-5 py-2.5 font-mono text-sm text-rt-text-dark">
            Reference: <strong>{refNumber}</strong>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm bg-rt-navy px-7 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-rt-navy-dark"
          >
            Back to home
          </Link>
          <a
            href={`tel:${phoneRaw}`}
            className="inline-flex items-center gap-2 rounded-sm border-2 border-rt-navy bg-transparent px-7 py-3 font-display text-sm font-bold uppercase tracking-wider text-rt-navy hover:bg-rt-navy-light"
          >
            {phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-2xl space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div id="field-name">
          <label htmlFor="sq-name" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
            Full name <span className="text-badge-red">*</span>
          </label>
          <input
            id="sq-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="First and last name"
            className={inputClass(!!errors.name)}
            aria-required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "sq-name-error" : undefined}
          />
          {errors.name ? (
            <span id="sq-name-error" className="mt-1 flex items-center gap-1 font-body text-xs text-badge-red" role="alert">
              <AlertCircle size={12} aria-hidden />
              {errors.name}
            </span>
          ) : null}
        </div>
        <div id="field-phone">
          <label htmlFor="sq-phone" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
            Phone <span className="text-badge-red">*</span>
          </label>
          <input
            id="sq-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Best number to reach you"
            className={inputClass(!!errors.phone)}
            aria-required
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "sq-phone-error" : undefined}
          />
          {errors.phone ? (
            <span id="sq-phone-error" className="mt-1 flex items-center gap-1 font-body text-xs text-badge-red" role="alert">
              <AlertCircle size={12} aria-hidden />
              {errors.phone}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div id="field-email">
          <label htmlFor="sq-email" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
            Email <span className="text-badge-red">*</span>
          </label>
          <input
            id="sq-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@company.com"
            className={inputClass(!!errors.email)}
            aria-required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "sq-email-error" : undefined}
          />
          {errors.email ? (
            <span id="sq-email-error" className="mt-1 flex items-center gap-1 font-body text-xs text-badge-red" role="alert">
              <AlertCircle size={12} aria-hidden />
              {errors.email}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor="sq-company" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
            Company <span className="font-normal text-rt-text-light">optional</span>
          </label>
          <input
            id="sq-company"
            type="text"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Business name"
            className={inputClass(false)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sq-service" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
            Service type <span className="font-normal text-rt-text-light">optional</span>
          </label>
          <select
            id="sq-service"
            value={form.service}
            onChange={(e) => handleChange("service", e.target.value)}
            className={`${inputClass(false)} cursor-pointer bg-white ${form.service ? "text-rt-text-dark" : "text-rt-text-light"}`}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value === "" ? "_placeholder" : opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sq-date" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
            Desired start <span className="font-normal text-rt-text-light">optional</span>
          </label>
          <input
            id="sq-date"
            type="date"
            value={form.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className={`${inputClass(false)} ${form.startDate ? "text-rt-text-dark" : "text-rt-text-light"}`}
          />
        </div>
      </div>

      <div id="field-description">
        <label htmlFor="sq-description" className="mb-1.5 block font-body text-xs font-semibold text-rt-text-dark">
          Project description <span className="text-badge-red">*</span>
        </label>
        <textarea
          id="sq-description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Vehicle types, pickup/delivery regions, timing, constraints…"
          rows={5}
          className={`min-h-[120px] w-full resize-y rounded-sm border px-3.5 py-3 font-body text-sm leading-relaxed outline-none transition-colors focus:border-rt-navy ${
            errors.description ? "border-badge-red" : "border-rt-gray-mid"
          }`}
          aria-required
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "sq-desc-error" : undefined}
        />
        {errors.description ? (
          <span id="sq-desc-error" className="mt-1 flex items-center gap-1 font-body text-xs text-badge-red" role="alert">
            <AlertCircle size={12} aria-hidden />
            {errors.description}
          </span>
        ) : null}
      </div>

      <div>
        <p className="mb-1.5 font-body text-xs font-semibold text-rt-text-dark">
          Photos <span className="font-normal text-rt-text-light">optional — up to {MAX_PHOTOS}</span>
        </p>
        {photos.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2.5">
            {photos.map((photo) => (
              <div key={photo.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-rt-gray-mid">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URLs */}
                <img
                  src={photo.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(ev) => {
                    if (ev.currentTarget.dataset.errored) return;
                    ev.currentTarget.dataset.errored = "1";
                    ev.currentTarget.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove ${photo.file.name}`}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 p-0 text-white"
                >
                  <X size={11} strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-rt-gray-mid bg-rt-gray text-rt-text-light hover:border-rt-navy"
              >
                <Upload size={16} aria-hidden />
                <span className="font-body text-[10px]">Add</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {photos.length === 0 ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload photos of your vehicles or paperwork"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-6 py-8 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-rt-navy focus-visible:ring-offset-2 ${
              isDragOver ? "border-rt-navy bg-rt-navy-light" : "border-rt-gray-mid bg-white"
            }`}
          >
            <Camera size={28} className={isDragOver ? "text-rt-navy" : "text-rt-text-light"} strokeWidth={1.5} aria-hidden />
            <p className={`font-body text-sm font-medium ${isDragOver ? "text-rt-navy" : "text-rt-text-mid"}`}>
              Drop photos here or click to browse
            </p>
            <p className="text-center font-body text-xs text-rt-text-light">
              JPG, PNG, WebP — max {MAX_PHOTO_MB}MB each, up to {MAX_PHOTOS} photos
            </p>
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          aria-hidden
          capture="environment"
          onChange={(ev) => {
            stagePhotos(ev.target.files);
            if (ev.target) ev.target.value = "";
          }}
        />
      </div>

      {submitError ? (
        <div className="flex gap-2 rounded-sm border border-badge-red/40 bg-badge-red/10 px-4 py-3" role="alert">
          <AlertCircle className="mt-0.5 shrink-0 text-badge-red" size={16} aria-hidden />
          <p className="font-body text-sm text-red-800">{submitError}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-sm bg-rt-navy font-display text-base font-bold uppercase tracking-widest text-white transition-colors hover:bg-rt-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" size={18} strokeWidth={2} aria-hidden />
            Submitting…
          </>
        ) : (
          <>
            Request a quote
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden />
          </>
        )}
      </button>

      <p className="text-center font-body text-xs leading-relaxed text-rt-text-light">
        We respond within one business day, Mon–Fri. Or call{" "}
        <a href={`tel:${phoneRaw}`} className="text-rt-blue hover:underline">
          {phoneDisplay}
        </a>
        .
      </p>
    </form>
  );
}

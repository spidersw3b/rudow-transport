"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminFleetAddPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    unit_number: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    vehicle_type: "Semi Truck",
    status: "Available",
    current_location: "",
    mileage: "",
    last_maintenance: "",
    image_url: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/fleet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit_number: form.unit_number || null,
          make: form.make,
          model: form.model,
          year: form.year ? Number(form.year) : null,
          vin: form.vin || null,
          vehicle_type: form.vehicle_type,
          status: form.status,
          current_location: form.current_location || null,
          mileage: form.mileage ? Number(form.mileage) : null,
          last_maintenance: form.last_maintenance || null,
          image_url: form.image_url || null,
        }),
      });
      if (res.ok) router.push("/admin/fleet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/fleet" className="text-sm font-semibold text-rt-blue hover:underline">
        ← Fleet
      </Link>
      <h1 className="font-display text-2xl font-bold text-rt-navy">Add fleet vehicle</h1>
      <form onSubmit={submit} className="space-y-4 rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Make *"
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.make}
            onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
          />
          <input
            required
            placeholder="Model *"
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            placeholder="Year"
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          />
          <input
            placeholder="Unit #"
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.unit_number}
            onChange={(e) => setForm((f) => ({ ...f, unit_number: e.target.value }))}
          />
        </div>
        <input
          placeholder="VIN"
          className="w-full rounded-sm border px-3 py-2 text-sm"
          value={form.vin}
          onChange={(e) => setForm((f) => ({ ...f, vin: e.target.value }))}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <select
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.vehicle_type}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_type: e.target.value }))}
          >
            {["Semi Truck", "Car Hauler", "Flatbed", "Box Truck", "Cargo Van", "Sprinter"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            {["Available", "In Transit", "In Maintenance", "Out of Service"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <input
          placeholder="Current location"
          className="w-full rounded-sm border px-3 py-2 text-sm"
          value={form.current_location}
          onChange={(e) => setForm((f) => ({ ...f, current_location: e.target.value }))}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            placeholder="Mileage"
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.mileage}
            onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))}
          />
          <input
            type="date"
            className="rounded-sm border px-3 py-2 text-sm"
            value={form.last_maintenance}
            onChange={(e) => setForm((f) => ({ ...f, last_maintenance: e.target.value }))}
          />
        </div>
        <input
          placeholder="Image URL (optional)"
          className="w-full rounded-sm border px-3 py-2 text-sm"
          value={form.image_url}
          onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-rt-navy py-3 text-sm font-bold uppercase text-white hover:bg-rt-navy-dark disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save vehicle"}
        </button>
      </form>
    </div>
  );
}

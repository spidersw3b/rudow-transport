"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Driver } from "@/types";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", license_number: "", license_expiry: "" });

  const load = async () => {
    const res = await fetch("/api/drivers");
    const data = await res.json();
    if (res.ok) setDrivers(data.drivers ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  async function addDriver(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        license_number: form.license_number || null,
        license_expiry: form.license_expiry || null,
      }),
    });
    if (res.ok) {
      setOpen(false);
      setForm({ name: "", email: "", phone: "", license_number: "", license_expiry: "" });
      void load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-rt-navy">Drivers</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-sm bg-rt-navy px-4 py-2 text-sm font-bold uppercase text-white hover:bg-rt-navy-dark"
        >
          Add driver
        </button>
      </div>
      <div className="overflow-x-auto rounded-sm border border-rt-gray-mid bg-white shadow-sm">
        <table className="min-w-full divide-y text-left text-sm">
          <thead className="bg-rt-navy-light/80 text-xs font-bold uppercase text-rt-navy">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">License #</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assignment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {drivers.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-rt-text-mid">{d.phone || "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-rt-text-mid">{d.license_number || "—"}</td>
                <td className="px-4 py-3 text-rt-text-mid">{d.license_expiry || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={String(d.status)} />
                </td>
                <td className="px-4 py-3 text-xs text-rt-text-mid">{d.current_assignment ? "Assigned" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase text-red-700"
                    onClick={async () => {
                      const res = await fetch(`/api/drivers/${d.id}`, { method: "DELETE" });
                      if (res.ok) void load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={addDriver}
            className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl"
          >
            <h2 className="font-display text-lg font-bold text-rt-navy">New driver</h2>
            <div className="mt-4 space-y-3">
              <input
                required
                placeholder="Name"
                className="w-full rounded-sm border px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                placeholder="Email"
                className="w-full rounded-sm border px-3 py-2 text-sm"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <input
                placeholder="Phone"
                className="w-full rounded-sm border px-3 py-2 text-sm"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <input
                placeholder="License #"
                className="w-full rounded-sm border px-3 py-2 text-sm"
                value={form.license_number}
                onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}
              />
              <input
                type="date"
                className="w-full rounded-sm border px-3 py-2 text-sm"
                value={form.license_expiry}
                onChange={(e) => setForm((f) => ({ ...f, license_expiry: e.target.value }))}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-sm border px-4 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-sm bg-rt-navy px-4 py-2 text-sm font-bold uppercase text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

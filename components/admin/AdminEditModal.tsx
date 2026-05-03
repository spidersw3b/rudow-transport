"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TransportRequest } from "@/types";

type Props = {
  open: boolean;
  request: TransportRequest | null;
  onClose: () => void;
  onSaved: () => void;
};

export function AdminEditModal({ open, request, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Partial<TransportRequest>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (request) setForm(request);
  }, [request]);

  async function save() {
    if (!request) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          priority: form.priority,
          tracking_number: form.tracking_number,
          driver_assigned: form.driver_assigned,
          estimated_completion: form.estimated_completion,
          origin_location: form.origin_location,
          destination: form.destination,
          customer_notes: form.customer_notes,
          admin_notes: form.admin_notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && request ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm font-bold text-rt-navy">{request.request_id}</p>
                <p className="font-body text-xs text-rt-text-mid">Edit transport request</p>
              </div>
              <button type="button" onClick={onClose} className="text-rt-text-mid hover:text-rt-navy">
                ✕
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Status</label>
                <select
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.status ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TransportRequest["status"] }))}
                >
                  {["Pending", "Accepted", "In Transit", "Delivered", "Cancelled"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Priority</label>
                <select
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.priority ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TransportRequest["priority"] }))}
                >
                  {["Low", "Medium", "High"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Tracking number</label>
                <input
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.tracking_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, tracking_number: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Driver assigned</label>
                <input
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.driver_assigned ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, driver_assigned: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Estimated completion</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={(form.estimated_completion as string)?.slice(0, 10) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, estimated_completion: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Origin</label>
                <input
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.origin_location ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, origin_location: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Destination</label>
                <input
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.destination ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Customer notes</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.customer_notes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, customer_notes: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase text-rt-text-mid">Admin notes</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  value={form.admin_notes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border border-rt-gray-mid px-4 py-2 text-sm font-bold uppercase text-rt-text-mid"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-sm bg-rt-navy px-5 py-2 text-sm font-bold uppercase text-white hover:bg-rt-navy-dark disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

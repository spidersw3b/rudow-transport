"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminEditModal } from "@/components/admin/AdminEditModal";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { RequestsTable } from "@/components/admin/RequestsTable";
import { SERVICE_OPTIONS } from "@/lib/service-options";
import type { TransportRequest } from "@/types";

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState<TransportRequest | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok) setRows(data.requests ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (type && r.service_type !== type) return false;
      if (email && !r.customer_email.toLowerCase().includes(email.toLowerCase())) return false;
      return true;
    });
  }, [rows, status, type, email]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "Pending").length;
    const inTransit = rows.filter((r) => r.status === "In Transit").length;
    const delivered = rows.filter((r) => r.status === "Delivered").length;
    const delayed = rows.filter((r) => r.status === "Delayed").length;
    return { total, pending, inTransit, delivered, delayed };
  }, [rows]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Status</label>
          <select
            className="mt-1 block rounded-sm border px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            {["Pending", "Accepted", "In Transit", "Delivered", "Cancelled"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Type</label>
          <select
            className="mt-1 block max-w-[220px] rounded-sm border px-3 py-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="text-xs font-semibold uppercase text-rt-text-mid">Search by email</label>
          <input
            className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="customer@email.com"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            void load();
          }}
          className="rounded-sm bg-rt-navy px-4 py-2 text-sm font-bold uppercase text-white hover:bg-rt-navy-dark"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setStatus("");
            setType("");
            setEmail("");
          }}
          className="rounded-sm border border-rt-gray-mid px-4 py-2 text-sm font-bold uppercase text-rt-text-mid"
        >
          Clear
        </button>
      </div>

      <AdminStatCards
        total={stats.total}
        pending={stats.pending}
        inTransit={stats.inTransit}
        delivered={stats.delivered}
        delayed={stats.delayed}
      />

      <div>
        <h2 className="mb-4 font-display text-xl font-bold text-rt-navy">Recent requests</h2>
        {loading ? (
          <p className="font-body text-sm text-rt-text-mid">Loading…</p>
        ) : (
          <RequestsTable
            rows={filtered}
            onEdit={(r) => {
              setActive(r);
              setModalOpen(true);
            }}
          />
        )}
      </div>

      <AdminEditModal
        open={modalOpen}
        request={active}
        onClose={() => setModalOpen(false)}
        onSaved={() => void load()}
      />
    </div>
  );
}

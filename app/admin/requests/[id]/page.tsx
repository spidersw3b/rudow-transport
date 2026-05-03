"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminEditModal } from "@/components/admin/AdminEditModal";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

export default function AdminRequestDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [req, setReq] = useState<TransportRequest | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/requests/${id}`);
    const data = await res.json();
    if (res.ok) setReq(data.request);
  }, [id]);

  useEffect(() => {
    if (id) void load();
  }, [id, load]);

  if (!req) {
    return (
      <div>
        <Link href="/admin/requests" className="text-sm text-rt-blue hover:underline">
          ← Back
        </Link>
        <p className="mt-6 font-body text-sm text-rt-text-mid">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/requests" className="text-sm font-semibold text-rt-blue hover:underline">
        ← All requests
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-rt-navy">{req.request_id}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={req.status} />
            <PriorityBadge priority={req.priority} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-sm bg-rt-navy px-4 py-2 text-sm font-bold uppercase text-white hover:bg-rt-navy-dark"
        >
          Edit request
        </button>
      </div>
      <div className="grid gap-6 rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase text-rt-text-mid">Customer</p>
          <p className="mt-1 font-body text-sm">{req.customer_name || "—"}</p>
          <p className="font-body text-sm text-rt-text-mid">{req.customer_email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-rt-text-mid">Service</p>
          <p className="mt-1 font-body text-sm">{req.service_type}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-rt-text-mid">Origin</p>
          <p className="mt-1 font-body text-sm">{req.origin_location || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-rt-text-mid">Destination</p>
          <p className="mt-1 font-body text-sm">{req.destination || "—"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase text-rt-text-mid">Instructions</p>
          <p className="mt-1 whitespace-pre-wrap font-body text-sm text-rt-text-mid">
            {req.special_instructions || "—"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase text-rt-text-mid">Admin notes</p>
          <p className="mt-1 whitespace-pre-wrap font-body text-sm text-rt-text-mid">{req.admin_notes || "—"}</p>
        </div>
      </div>

      <AdminEditModal open={open} request={req} onClose={() => setOpen(false)} onSaved={load} />
    </div>
  );
}

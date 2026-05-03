"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import type { TransportRequest } from "@/types";

export default function AdminReportsPage() {
  const [rows, setRows] = useState<TransportRequest[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok) setRows(data.requests ?? []);
    })();
  }, []);

  const delivered = rows.filter((r) => r.status === "Delivered").length;
  const pending = rows.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-rt-navy">Reports</h1>
      <p className="font-body text-sm text-rt-text-mid">High-level operational snapshot from live request data.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total requests" value={rows.length} borderClass="border-b-4 border-rt-navy" />
        <StatCard label="Delivered" value={delivered} borderClass="border-b-4 border-badge-green" />
        <StatCard label="Pending intake" value={pending} borderClass="border-b-4 border-badge-yellow" />
      </div>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-rt-navy">Export</h2>
        <p className="mt-2 font-body text-sm text-rt-text-mid">
          Connect your BI tool or Supabase SQL exports for deeper reporting. This view stays lightweight
          for daily operations.
        </p>
      </div>
    </div>
  );
}

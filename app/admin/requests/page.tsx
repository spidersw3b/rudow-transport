"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

export default function AdminRequestsPage() {
  const [rows, setRows] = useState<TransportRequest[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok) setRows(data.requests ?? []);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-rt-navy">All transport requests</h1>
      <div className="mt-6 overflow-x-auto rounded-sm border border-rt-gray-mid bg-white shadow-sm">
        <table className="min-w-full divide-y divide-rt-gray-mid text-left text-sm">
          <thead className="bg-rt-navy-light/80 text-xs font-bold uppercase text-rt-navy">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3 text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rt-gray-mid">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-rt-navy">{r.request_id}</td>
                <td className="px-4 py-3 text-rt-text-mid">{r.customer_email}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-rt-text-mid">{r.service_type}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={r.priority} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/requests/${r.id}`}
                    className="text-sm font-bold uppercase text-rt-blue hover:underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

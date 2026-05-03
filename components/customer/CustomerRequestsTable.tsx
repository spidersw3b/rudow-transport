"use client";

import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

type Props = {
  rows: TransportRequest[];
  onView: (r: TransportRequest) => void;
};

export function CustomerRequestsTable({ rows, onView }: Props) {
  return (
    <div className="overflow-x-auto rounded-sm border border-rt-gray-mid bg-white shadow-sm">
      <table className="min-w-full divide-y divide-rt-gray-mid text-left text-sm">
        <thead className="bg-rt-navy-light/80 text-xs font-bold uppercase tracking-wide text-rt-navy">
          <tr>
            <th className="px-4 py-3">Request ID</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Origin → Destination</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rt-gray-mid">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-rt-navy-light/40">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-rt-navy">
                {r.request_id}
              </td>
              <td className="max-w-[160px] truncate px-4 py-3 text-rt-text-mid">{r.service_type}</td>
              <td className="max-w-[220px] truncate px-4 py-3 text-rt-text-mid">
                {(r.origin_location || "—") + " → " + (r.destination || "—")}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-rt-text-mid">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onView(r)}
                  className="rounded-sm border border-rt-navy px-3 py-1 text-xs font-bold uppercase text-rt-navy hover:bg-rt-navy hover:text-white"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

type Props = {
  rows: TransportRequest[];
  onEdit: (r: TransportRequest) => void;
};

export function RequestsTable({ rows, onEdit }: Props) {
  return (
    <div className="overflow-x-auto rounded-sm border border-rt-gray-mid bg-white shadow-sm">
      <table className="min-w-full divide-y divide-rt-gray-mid text-left text-sm">
        <thead className="bg-rt-navy-light/80 font-body text-xs font-bold uppercase tracking-wide text-rt-navy">
          <tr>
            <th className="px-4 py-3">Request ID</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3 text-right">Edit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rt-gray-mid">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-rt-navy-light/40">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-rt-navy">
                {r.request_id}
              </td>
              <td className="px-4 py-3 text-rt-text-mid">{r.customer_email}</td>
              <td className="whitespace-nowrap px-4 py-3 text-rt-text-mid">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="max-w-[180px] truncate px-4 py-3 text-rt-text-mid">{r.service_type}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={r.priority} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(r)}
                  className="rounded-sm border border-rt-navy px-3 py-1 text-xs font-bold uppercase text-rt-navy hover:bg-rt-navy hover:text-white"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

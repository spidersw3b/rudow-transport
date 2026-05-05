"use client";

import Link from "next/link";

export type CustomerRow = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
  request_count?: number;
};

export function CustomerTable({ rows }: { rows: CustomerRow[] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-rt-gray-mid bg-white shadow-sm">
      <table className="min-w-full divide-y divide-rt-gray-mid text-left text-sm">
        <thead className="bg-rt-navy-light/80 text-xs font-bold uppercase tracking-wide text-rt-navy">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Requests</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3 text-right">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rt-gray-mid">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-rt-navy-light/40">
              <td className="px-4 py-3 font-medium text-rt-text-dark">{r.name || "—"}</td>
              <td className="px-4 py-3 text-rt-text-mid">{r.email}</td>
              <td className="px-4 py-3 text-rt-text-mid">{r.company || "—"}</td>
              <td className="px-4 py-3 text-rt-text-mid">{r.phone || "—"}</td>
              <td className="px-4 py-3 text-rt-text-mid">{r.request_count ?? 0}</td>
              <td className="whitespace-nowrap px-4 py-3 text-rt-text-mid">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/customers/${r.id}`}
                  className="rounded-sm border border-rt-navy px-3 py-1 text-xs font-bold uppercase text-rt-navy hover:bg-rt-navy hover:text-white"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

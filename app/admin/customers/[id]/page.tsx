"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

type Customer = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
};

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [requests, setRequests] = useState<TransportRequest[]>([]);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      if (res.ok) {
        setCustomer(data.customer);
        setRequests(data.requests ?? []);
      }
    })();
  }, [id]);

  if (!customer) {
    return (
      <div>
        <Link href="/admin/customers" className="text-sm text-rt-blue hover:underline">
          ← Customers
        </Link>
        <p className="mt-6 text-sm text-rt-text-mid">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/customers" className="text-sm font-semibold text-rt-blue hover:underline">
        ← Customers
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold text-rt-navy">{customer.name || "Customer"}</h1>
        <p className="mt-1 font-body text-sm text-rt-text-mid">{customer.email}</p>
        <p className="mt-2 font-body text-sm text-rt-text-mid">
          {customer.company || "No company"} · {customer.phone || "No phone"}
        </p>
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-rt-navy">Requests</h2>
        <div className="mt-4 overflow-x-auto rounded-sm border border-rt-gray-mid bg-white">
          <table className="min-w-full divide-y text-left text-sm">
            <thead className="bg-rt-navy-light/80 text-xs font-bold uppercase text-rt-navy">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono text-xs">{r.request_id}</td>
                  <td className="px-4 py-3 text-rt-text-mid">{r.service_type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CustomerTable, type CustomerRow } from "@/components/admin/CustomerTable";

export default function AdminCustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (res.ok) setRows(data.customers ?? []);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-rt-navy">Customers</h1>
      <p className="mt-2 font-body text-sm text-rt-text-mid">Portal accounts with the customer role.</p>
      <input
        className="mt-4 w-full max-w-sm rounded-sm border px-3 py-2 text-sm"
        placeholder="Search name, email, company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mt-8">
        <CustomerTable
          rows={rows.filter((row) =>
            `${row.name ?? ""} ${row.email} ${row.company ?? ""}`.toLowerCase().includes(search.toLowerCase())
          )}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import type { TransportRequest } from "@/types";

export default function AdminReportsPage() {
  const [rows, setRows] = useState<TransportRequest[]>([]);
  const [reportSummary, setReportSummary] = useState("");
  const [reports, setReports] = useState<Array<{ id: string; report_month: string; summary: string; created_at: string }>>([]);
  const [documents, setDocuments] = useState<Array<{ id: string; file_name: string; status: string; created_at: string }>>([]);
  const [users, setUsers] = useState<Array<{ id: string; email: string; role: string }>>([]);

  useEffect(() => {
    void (async () => {
      const [requestsRes, reportsRes, docsRes, usersRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/reports"),
        fetch("/api/reports/documents"),
        fetch("/api/users"),
      ]);
      const [requestsData, reportsData, docsData, usersData] = await Promise.all([
        requestsRes.json(),
        reportsRes.json(),
        docsRes.json(),
        usersRes.json(),
      ]);
      if (requestsRes.ok) setRows(requestsData.requests ?? []);
      if (reportsRes.ok) setReports(reportsData.reports ?? []);
      if (docsRes.ok) setDocuments(docsData.documents ?? []);
      if (usersRes.ok) setUsers(usersData.users ?? []);
    })();
  }, []);

  const delivered = rows.filter((r) => r.status === "Delivered").length;
  const pending = rows.filter((r) => r.status === "Pending").length;
  const inProgress = rows.filter((r) => r.status === "In Transit" || r.status === "Accepted").length;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-rt-navy">Reports</h1>
      <p className="font-body text-sm text-rt-text-mid">High-level operational snapshot from live request data.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total requests" value={rows.length} borderClass="border-b-4 border-rt-navy" />
        <StatCard label="Delivered" value={delivered} borderClass="border-b-4 border-badge-green" />
        <StatCard label="Pending intake" value={pending} borderClass="border-b-4 border-badge-yellow" />
        <StatCard label="In progress" value={inProgress} borderClass="border-b-4 border-rt-blue" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-rt-navy">Monthly trends</h2>
          <p className="mt-2 text-sm text-rt-text-mid">Delivered ratio: {rows.length ? Math.round((delivered / rows.length) * 100) : 0}%</p>
          <p className="mt-1 text-sm text-rt-text-mid">Open demand: {pending + inProgress}</p>
          <button type="button" onClick={() => window.print()} className="mt-4 rounded-sm border border-rt-gray-mid px-3 py-2 text-xs font-bold uppercase text-rt-navy">
            Print-friendly output
          </button>
        </div>
        <div className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-rt-navy">Generate report</h2>
          <textarea className="mt-3 w-full rounded-sm border px-3 py-2 text-sm" rows={4} value={reportSummary} onChange={(e) => setReportSummary(e.target.value)} placeholder="Monthly operations summary..." />
          <button
            type="button"
            className="mt-3 rounded-sm bg-rt-navy px-4 py-2 text-xs font-bold uppercase text-white"
            onClick={async () => {
              const month = new Date().toISOString().slice(0, 7);
              const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ report_month: month, summary: reportSummary || "Operations report" }),
              });
              if (res.ok) window.location.reload();
            }}
          >
            Save report
          </button>
        </div>
      </div>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-rt-navy">Report history</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {reports.map((report) => (
            <li key={report.id} className="flex items-center justify-between border-b pb-2">
              <span>{report.report_month} - {report.summary}</span>
              <span className="text-xs text-rt-text-mid">{new Date(report.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-rt-navy">Document submission tracking</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {documents.slice(0, 10).map((doc) => (
            <li key={doc.id} className="flex items-center justify-between border-b pb-2">
              <span>{doc.file_name}</span>
              <span>{doc.status}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-rt-navy">User analytics</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {users.slice(0, 12).map((user) => (
            <li key={user.id} className="flex items-center justify-between border-b pb-2">
              <span>{user.email}</span>
              <span className="text-xs uppercase text-rt-text-mid">{user.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

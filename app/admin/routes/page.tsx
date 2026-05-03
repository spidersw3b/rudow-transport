"use client";

import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

type RouteRow = {
  routeId: string;
  origin: string;
  destination: string;
  driver: string;
  vehicle: string;
  status: string;
  eta: string;
};

export default function AdminRoutesPage() {
  const [rows, setRows] = useState<TransportRequest[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok) setRows(data.requests ?? []);
    })();
  }, []);

  const routes: RouteRow[] = useMemo(() => {
    return rows
      .filter((r) => r.status === "In Transit" || r.status === "Accepted")
      .map((r, i) => ({
        routeId: `RT-${String(i + 1).padStart(4, "0")}`,
        origin: r.origin_location || "TBD",
        destination: r.destination || "TBD",
        driver: r.driver_assigned || "Unassigned",
        vehicle: "Fleet unit",
        status: r.status,
        eta: r.estimated_completion || "—",
      }));
  }, [rows]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-rt-navy">Routes</h1>
      <p className="font-body text-sm text-rt-text-mid">
        Active and scheduled routes derived from in-progress transport requests.
      </p>
      <div className="overflow-x-auto rounded-sm border border-rt-gray-mid bg-white shadow-sm">
        <table className="min-w-full divide-y text-left text-sm">
          <thead className="bg-rt-navy-light/80 text-xs font-bold uppercase text-rt-navy">
            <tr>
              <th className="px-4 py-3">Route ID</th>
              <th className="px-4 py-3">Origin</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">ETA</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {routes.map((r) => (
              <tr key={r.routeId}>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-rt-navy">{r.routeId}</td>
                <td className="px-4 py-3 text-rt-text-mid">{r.origin}</td>
                <td className="px-4 py-3 text-rt-text-mid">{r.destination}</td>
                <td className="px-4 py-3 text-rt-text-mid">{r.driver}</td>
                <td className="px-4 py-3 text-rt-text-mid">{r.vehicle}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-rt-text-mid">{r.eta}</td>
                <td className="px-4 py-3 text-right text-xs font-bold uppercase text-rt-blue">Manage</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

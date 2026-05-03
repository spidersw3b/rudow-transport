"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { FleetGrid } from "@/components/admin/FleetGrid";
import { StatCard } from "@/components/shared/StatCard";
import type { FleetVehicle } from "@/types";

export default function AdminFleetPage() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/fleet");
      const data = await res.json();
      if (res.ok) setVehicles(data.vehicles ?? []);
    })();
  }, []);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const hay = `${v.unit_number} ${v.vin} ${v.make} ${v.model}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (type && String(v.vehicle_type) !== type) return false;
      if (status && String(v.status) !== status) return false;
      if (location && !(v.current_location || "").toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });
  }, [vehicles, q, type, status, location]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === "Available").length,
      transit: vehicles.filter((v) => v.status === "In Transit").length,
      maintenance: vehicles.filter((v) => v.status === "In Maintenance").length,
      oos: vehicles.filter((v) => v.status === "Out of Service").length,
    };
  }, [vehicles]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-rt-navy">Fleet</h1>
        <Link
          href="/admin/fleet/add"
          className="rounded-sm bg-rt-navy px-4 py-2 text-sm font-bold uppercase text-white hover:bg-rt-navy-dark"
        >
          Add vehicle
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search unit / VIN"
          className="min-w-[180px] flex-1 rounded-sm border px-3 py-2 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="rounded-sm border px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {["Semi Truck", "Car Hauler", "Flatbed", "Box Truck", "Cargo Van", "Sprinter"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select className="rounded-sm border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {["Available", "In Transit", "In Maintenance", "Out of Service"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          placeholder="Location"
          className="min-w-[160px] rounded-sm border px-3 py-2 text-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} borderClass="border-b-4 border-rt-navy" />
        <StatCard label="Available" value={stats.available} borderClass="border-b-4 border-badge-green" />
        <StatCard label="In transit" value={stats.transit} borderClass="border-b-4 border-badge-blue" />
        <StatCard label="In maintenance" value={stats.maintenance} borderClass="border-b-4 border-badge-yellow" />
        <StatCard label="Out of service" value={stats.oos} borderClass="border-b-4 border-badge-red" />
      </div>

      <FleetGrid vehicles={filtered} />
    </div>
  );
}

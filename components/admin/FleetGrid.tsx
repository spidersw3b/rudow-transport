"use client";

import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { FleetVehicle } from "@/types";

type Props = {
  vehicles: FleetVehicle[];
};

export function FleetGrid({ vehicles }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {vehicles.map((v) => (
        <article
          key={v.id}
          className="group overflow-hidden rounded-sm border border-rt-gray-mid bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative h-40 w-full bg-rt-navy-light">
            {v.image_url ? (
              <Image src={v.image_url} alt={`${v.make} ${v.model}`} fill className="object-cover" sizes="300px" />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-sm text-rt-navy/40">
                No photo
              </div>
            )}
            <div className="absolute right-2 top-2">
              <StatusBadge status={String(v.status)} />
            </div>
          </div>
          <div className="p-4">
            <p className="font-display text-lg font-bold text-rt-navy">
              {v.year} {v.make} {v.model}
            </p>
            <p className="mt-1 font-body text-xs text-rt-text-mid">
              {v.vehicle_type || "—"} {v.unit_number ? `· Unit ${v.unit_number}` : ""}
            </p>
            <p className="mt-2 font-mono text-[11px] text-rt-text-mid">VIN: {v.vin || "—"}</p>
            <p className="font-body text-xs text-rt-text-mid">
              {v.mileage != null ? `${v.mileage.toLocaleString()} mi` : "—"} · {v.current_location || "Location TBD"}
            </p>
            <p className="mt-1 font-body text-xs text-rt-text-mid">
              Last maintenance: {v.last_maintenance || "—"}
            </p>
            <Link
              href={`/admin/fleet?focus=${v.id}`}
              className="mt-3 inline-block text-xs font-bold uppercase text-rt-blue hover:underline"
            >
              View
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

"use client";

import { StatCard } from "@/components/shared/StatCard";

type Props = {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  delayed: number;
};

export function AdminStatCards({ total, pending, inTransit, delivered, delayed }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Total count" value={total} borderClass="border-b-4 border-rt-navy" />
      <StatCard label="Pending" value={pending} borderClass="border-b-4 border-badge-yellow" />
      <StatCard label="In transit" value={inTransit} borderClass="border-b-4 border-badge-blue" />
      <StatCard label="Delivered" value={delivered} borderClass="border-b-4 border-badge-green" />
      <StatCard label="Delayed" value={delayed} borderClass="border-b-4 border-badge-red" />
    </div>
  );
}

"use client";

import { StatCard } from "@/components/shared/StatCard";

type Props = {
  pending: number;
  accepted: number;
  inTransit: number;
  delivered: number;
};

export function CustomerStatCards({ pending, accepted, inTransit, delivered }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Pending" value={pending} borderClass="border-b-4 border-badge-yellow" />
      <StatCard label="Accepted" value={accepted} borderClass="border-b-4 border-badge-blue" />
      <StatCard label="In transit" value={inTransit} borderClass="border-b-4 border-badge-orange" />
      <StatCard label="Delivered" value={delivered} borderClass="border-b-4 border-badge-green" />
    </div>
  );
}

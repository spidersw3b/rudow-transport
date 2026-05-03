const map: Record<string, string> = {
  Pending: "bg-badge-yellow/15 text-amber-800 ring-1 ring-amber-400/40",
  Accepted: "bg-badge-blue/15 text-blue-800 ring-1 ring-blue-400/40",
  "In Transit": "bg-badge-orange/15 text-orange-900 ring-1 ring-orange-400/40",
  Delivered: "bg-badge-green/15 text-green-800 ring-1 ring-green-400/40",
  Cancelled: "bg-badge-red/15 text-red-800 ring-1 ring-red-400/40",
  Available: "bg-badge-green/15 text-green-800 ring-1 ring-green-400/40",
  "In Maintenance": "bg-badge-yellow/15 text-amber-900 ring-1 ring-amber-400/40",
  "Out of Service": "bg-badge-red/15 text-red-800 ring-1 ring-red-400/40",
  "On Route": "bg-badge-blue/15 text-blue-800 ring-1 ring-blue-400/40",
  "Off Duty": "bg-rt-gray-mid text-rt-text-mid ring-1 ring-rt-gray-mid",
  Inactive: "bg-rt-gray text-rt-text-mid ring-1 ring-rt-gray-mid",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = map[status] ?? "bg-rt-navy-light text-rt-navy ring-1 ring-rt-navy/20";
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

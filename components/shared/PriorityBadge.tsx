const map: Record<string, string> = {
  Low: "bg-rt-navy-light text-rt-navy",
  Medium: "bg-rt-blue-light text-rt-blue-dark",
  High: "bg-badge-orange/20 text-orange-900",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const cls = map[priority] ?? "bg-rt-gray text-rt-text-mid";
  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-bold uppercase ${cls}`}>
      {priority}
    </span>
  );
}

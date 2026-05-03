import { Check } from "lucide-react";

export function NavyCheckmark({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 font-body text-sm text-white/95 md:text-base">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rt-navy text-white">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function NavyCheckmarkLight({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 font-body text-sm text-rt-text-dark md:text-base">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rt-navy/10 text-rt-navy">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

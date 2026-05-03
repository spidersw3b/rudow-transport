export function RoadLogoMark({ className = "h-10 w-10 text-rt-navy" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M8 40 L24 8 L40 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 40 L24 18 L34 40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M20 40 L24 28 L28 40"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

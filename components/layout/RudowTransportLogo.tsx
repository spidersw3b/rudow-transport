import Image from "next/image";

/** Place your transparent PNG here (replace the tiny placeholder). */
export const RUDOW_TRANSPORT_LOGO = "/images/rudow-transportation-logo.png";

type RudowTransportLogoProps = {
  className?: string;
  /** Slightly smaller for mobile drawer / auth cards. */
  compact?: boolean;
};

/**
 * Brand lockup from `public/images/rudow-transportation-logo.png` (transparent).
 * Replace that file with your exported asset; keep the same filename or update `RUDOW_TRANSPORT_LOGO`.
 */
export function RudowTransportLogo({ className = "", compact = false }: RudowTransportLogoProps) {
  const sizeClass = compact
    ? "h-8 max-h-9 w-auto max-w-[200px] sm:h-9"
    : "h-9 max-h-10 w-auto max-w-[220px] md:h-10 md:max-w-[280px]";

  return (
    <Image
      src={RUDOW_TRANSPORT_LOGO}
      alt="Rudow Transportation"
      width={560}
      height={140}
      className={`object-contain object-left ${sizeClass} ${className}`.trim()}
      sizes={compact ? "200px" : "(max-width: 768px) 220px, 280px"}
      priority
    />
  );
}

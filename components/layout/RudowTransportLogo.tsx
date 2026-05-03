"use client";

import Image from "next/image";

/** Raster brand lockup in `public/images/`. */
export const RUDOW_TRANSPORT_LOGO = "/images/rudow-transportation-logo.png";

const LOGO_NATURAL_W = 1124;
const LOGO_NATURAL_H = 332;

const logoImgClass =
  "block h-9 w-auto max-w-[230px] shrink-0 object-contain object-left md:h-10 md:max-w-[280px]";

type RudowTransportLogoProps = {
  className?: string;
  /** Set true in header for faster LCP (optional). */
  priority?: boolean;
};

export function RudowTransportLogo({ className = "", priority = false }: RudowTransportLogoProps) {
  return (
    <Image
      src={RUDOW_TRANSPORT_LOGO}
      alt="Rudow Transportation"
      width={LOGO_NATURAL_W}
      height={LOGO_NATURAL_H}
      priority={priority}
      sizes="(min-width: 768px) 280px, 230px"
      className={`${logoImgClass} ${className}`.trim()}
    />
  );
}

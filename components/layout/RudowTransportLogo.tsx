"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Raster brand lockup in `public/images/`. SVG below is fallback if the file is missing.
 */
export const RUDOW_TRANSPORT_LOGO = "/images/rudow-transportation-logo.png";

const NAVY = "#0a3061";
const SILVER = "#a3abb8";
const SWOOSH = "#f8fafc";

const LOGO_NATURAL_W = 1124;
const LOGO_NATURAL_H = 332;

const logoImgClass =
  "block h-9 w-auto max-w-[230px] shrink-0 object-contain object-left md:h-10 md:max-w-[280px]";

type RudowTransportLogoProps = {
  className?: string;
  compact?: boolean;
  /** Set true in header for faster LCP (optional). */
  priority?: boolean;
};

function RudowTransportLogoSvg({ className = "", compact = false }: RudowTransportLogoProps) {
  const vbW = compact ? 288 : 308;
  const vbH = compact ? 40 : 46;
  const rudowSize = compact ? 21 : 25;
  const subSize = compact ? 6.75 : 7.75;
  const subY = compact ? 35 : 41;
  const textX = compact ? 68 : 78;
  const sw = compact ? 6.2 : 7;
  const swMid = compact ? 4.8 : 5.5;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={`${logoImgClass} ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Rudow Transportation"
    >
      <title>Rudow Transportation</title>

      <path
        d="M 4 39 C 14 30, 28 18, 58 7"
        stroke={NAVY}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 7 36 C 17 26, 32 15, 60 9"
        stroke={SILVER}
        strokeWidth={swMid}
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x="17"
        y="25"
        width="5"
        height="2.8"
        rx="0.35"
        fill={NAVY}
        transform="rotate(-42 19.5 26.4)"
      />
      <rect
        x="26"
        y="18"
        width="5"
        height="2.8"
        rx="0.35"
        fill={NAVY}
        transform="rotate(-42 28.5 19.4)"
      />
      <rect
        x="35"
        y="12"
        width="5"
        height="2.8"
        rx="0.35"
        fill={NAVY}
        transform="rotate(-42 37.5 13.4)"
      />
      <path
        d="M 11 31 C 22 18, 38 9, 64 4"
        stroke={NAVY}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 42 41 Q 54 26 64 14 L 60 16 Q 50 32 42 41 Z"
        fill={SWOOSH}
        strokeLinejoin="round"
      />

      <text
        x={textX}
        y={compact ? 23 : 27}
        fill={NAVY}
        fontFamily="Oswald, Impact, system-ui, sans-serif"
        fontSize={rudowSize}
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        RUDOW
      </text>
      <text
        x={textX}
        y={subY}
        fill={SILVER}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={subSize}
        fontWeight="600"
        letterSpacing="0.28em"
      >
        TRANSPORTATION
      </text>
    </svg>
  );
}

export function RudowTransportLogo({
  className = "",
  compact = false,
  priority = false,
}: RudowTransportLogoProps) {
  const [rasterFailed, setRasterFailed] = useState(false);

  if (rasterFailed) {
    return <RudowTransportLogoSvg className={className} compact={compact} />;
  }

  return (
    <Image
      src={RUDOW_TRANSPORT_LOGO}
      alt="Rudow Transportation"
      width={LOGO_NATURAL_W}
      height={LOGO_NATURAL_H}
      priority={priority}
      sizes="(min-width: 768px) 280px, 230px"
      className={`${logoImgClass} ${className}`.trim()}
      onError={() => setRasterFailed(true)}
    />
  );
}

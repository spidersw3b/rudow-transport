"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { RoadLogoMark } from "./RoadLogoMark";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rt-gray-mid bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <RoadLogoMark className="h-9 w-9 text-rt-navy md:h-10 md:w-10" />
          <div className="leading-tight">
            <span className="block font-display text-xl font-bold italic text-rt-navy md:text-2xl">RUDOW</span>
            <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-rt-navy-mid md:text-[11px]">
              Transportation
            </span>
          </div>
        </Link>

        <nav className="hidden flex-1 justify-center gap-8 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`font-body text-sm font-medium transition-colors ${
                  active
                    ? "text-rt-navy underline decoration-2 underline-offset-8"
                    : "text-rt-text-dark hover:text-rt-navy"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-sm bg-rt-blue px-5 py-2 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-blue-dark lg:inline-flex"
          >
            Contact
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

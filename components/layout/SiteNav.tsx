"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { RudowTransportLogo } from "./RudowTransportLogo";

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
        <Link
          href="/"
          className="block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rt-navy focus-visible:ring-offset-2"
        >
          <RudowTransportLogo priority />
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

        <div className="flex items-center gap-2 lg:gap-3">
          <Link
            href="/manage/login"
            className={`inline-flex shrink-0 items-center gap-2 rounded-sm border-2 border-black px-3 py-2 font-body text-sm font-semibold text-black transition-colors hover:bg-rt-gray focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
              pathname.startsWith("/manage") ? "bg-rt-gray" : ""
            }`}
          >
            <LogIn className="h-5 w-5 shrink-0 text-black" strokeWidth={2} aria-hidden />
            Login
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-sm bg-rt-blue px-5 py-2 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-blue-dark lg:inline-flex"
          >
            GET QUOTE
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

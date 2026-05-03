"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { RoadLogoMark } from "./RoadLogoMark";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        className="rounded-sm p-2 text-rt-navy"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-7 w-7" />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-rt-gray-mid px-4 py-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <RoadLogoMark className="h-9 w-9 text-rt-navy" />
                <div className="leading-tight">
                  <span className="block font-display text-xl font-bold italic text-rt-navy">RUDOW</span>
                  <span className="block font-body text-[11px] font-semibold uppercase tracking-widest text-rt-navy-mid">
                    Transportation
                  </span>
                </div>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-sm p-2 text-rt-navy"
                onClick={() => setOpen(false)}
              >
                <X className="h-7 w-7" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 px-8 py-10">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`font-body text-lg font-medium ${
                      active ? "text-rt-navy underline decoration-2 underline-offset-8" : "text-rt-text-dark"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-sm bg-rt-blue px-5 py-3 font-body text-sm font-bold uppercase tracking-wide text-white"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

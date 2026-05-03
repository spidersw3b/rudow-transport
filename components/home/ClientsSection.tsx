"use client";

import { motion } from "framer-motion";

export function ClientsSection() {
  return (
    <section className="border-t border-rt-gray-mid bg-rt-navy-light py-12">
      <div className="mx-auto max-w-7xl px-4 text-center md:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-body text-xs font-bold uppercase tracking-[0.35em] text-rt-navy"
        >
          Our clients
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-10 opacity-60 grayscale">
          {["Fleet Partners", "National Retail", "Construction", "Dealership Groups"].map((n) => (
            <span
              key={n}
              className="font-display text-lg font-bold uppercase tracking-widest text-rt-text-mid"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <Image
        src={IMG.heroFleet}
        alt="Commercial fleet at loading dock"
        fill
        priority
        className="object-cover saturate-[0.85]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/30 to-white/40" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center px-4 py-24 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-xl"
        >
          <h1 className="font-display text-4xl font-bold leading-tight text-white drop-shadow-sm md:text-5xl lg:text-[64px] lg:leading-[1.05]">
            Move Freight Without Delays.
          </h1>
          <h1 className="mt-1 font-display text-4xl font-bold leading-tight text-white drop-shadow-sm md:text-5xl lg:text-[64px] lg:leading-[1.05]">
            Without Guesswork.
          </h1>
          <p className="mt-6 font-body text-base text-white drop-shadow-sm md:text-lg">
            From single-unit deliveries to full fleet transport, we move what matters—on time, every
            time.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-sm bg-rt-navy px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark"
            >
              Get a Quote
            </Link>
            <Link
              href="/transport-quote"
              className="inline-flex items-center justify-center rounded-sm border-2 border-rt-navy-dark bg-white/80 px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-rt-navy-dark hover:bg-rt-navy-dark hover:text-white"
            >
              Schedule Transport
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

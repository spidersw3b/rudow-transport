"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NavyCheckmark } from "@/components/shared/NavyCheckmark";
import { IMG } from "@/lib/images";

export function ScalePrecisionSection() {
  return (
    <section className="relative min-h-[420px] w-full overflow-hidden md:min-h-[480px]">
      <Image
        src={IMG.desertHighway}
        alt="Semi truck on highway at golden hour"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-transparent md:w-[55%]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="max-w-xl md:w-1/2"
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Built For Scale.</h2>
          <h2 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
            Trusted For Precision.
          </h2>
          <p className="mt-6 font-body text-sm leading-relaxed text-white/90 md:text-base">
            We handle everything from individual truck deliveries to full fleet relocation. Whether
            you&apos;re moving inventory, fulfilling contracts, or scaling operations, our logistics
            are built to keep your business moving.
          </p>
          <ul className="mt-8 space-y-4">
            <NavyCheckmark>Dedicated transport routes</NavyCheckmark>
            <NavyCheckmark>Experienced commercial drivers</NavyCheckmark>
            <NavyCheckmark>Fully insured &amp; compliant</NavyCheckmark>
            <NavyCheckmark>Real-time coordination from pickup to delivery</NavyCheckmark>
          </ul>
        </motion.div>
        <div className="hidden flex-1 md:block" />
      </div>
    </section>
  );
}

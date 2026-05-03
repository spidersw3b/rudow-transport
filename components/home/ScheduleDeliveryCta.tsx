"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { NavyCheckmarkLight } from "@/components/shared/NavyCheckmark";
import { IMG } from "@/lib/images";

export function ScheduleDeliveryCta() {
  return (
    <section className="relative min-h-[520px] w-full overflow-hidden md:min-h-[560px]">
      <Image
        src={IMG.warehouseDock}
        alt="Fleet at warehouse dock"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Schedule Fleet Delivery
          </h2>
          <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/90 md:text-base">
            From single-unit deliveries to full fleet transport, we move what matters—on time,
            every time.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-sm bg-rt-navy-dark px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-black"
          >
            Get Delivery
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-sm border border-white/30 bg-white/90 p-8 shadow-md backdrop-blur-sm"
        >
          <h3 className="font-display text-xl font-bold text-rt-navy">Full-Service Fleet Transport</h3>
          <ul className="mt-6 space-y-3">
            <NavyCheckmarkLight>Coordinated multi-vehicle moves</NavyCheckmarkLight>
            <NavyCheckmarkLight>Dedicated dispatch support</NavyCheckmarkLight>
            <NavyCheckmarkLight>Transparent status updates</NavyCheckmarkLight>
            <NavyCheckmarkLight>Compliance-first operations</NavyCheckmarkLight>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

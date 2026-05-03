"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import { IMG } from "@/lib/images";
import { ServicesAccordion } from "./ServicesAccordion";

export function ServicesHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:min-h-[560px] lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center px-4 py-12 md:px-6 lg:col-span-2 lg:px-10 lg:py-16"
        >
          <p className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.25em] text-rt-navy">
            <Play className="h-3 w-3 fill-current" />
            Our services
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-rt-text-dark md:text-[40px] md:leading-tight lg:text-[48px]">
            Diverse solutions tailored to your every need
          </h1>
        </motion.div>
        <div className="relative min-h-[280px] lg:col-span-3 lg:min-h-full">
          <Image
            src={IMG.carHauler}
            alt="Car hauler truck"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-rt-gray-mid px-4 pb-16 md:px-6 lg:px-10">
        <ServicesAccordion />
      </div>
    </section>
  );
}

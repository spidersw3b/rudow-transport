"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="border-t border-rt-gray-mid pt-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              <h1 className="font-display text-4xl font-bold leading-tight text-rt-navy md:text-5xl lg:text-[56px]">
                We Deliver For Success
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="space-y-6 lg:col-span-3"
            >
              <p className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.25em] text-rt-navy">
                <Play className="h-3 w-3 fill-current" />
                Our mission
              </p>
              <p className="font-body text-base leading-relaxed text-rt-text-mid md:text-lg">
                Rudow Transportation is built around one promise: dependable freight solutions delivered
                with speed, consistency, and care. We understand that every shipment matters, whether it
                is a single urgent load or ongoing transportation support for growing operations. Our
                team is committed to keeping freight moving efficiently so our customers can stay focused
                on their business.
              </p>
              <p className="font-body text-base leading-relaxed text-rt-text-mid md:text-lg">
                With a strong focus on communication, reliability, and on-time execution, we create
                transportation solutions that adapt to changing schedules, tight deadlines, and unique
                load requirements. No matter the size, scope, or urgency, we deliver with professionalism
                every mile of the way.
              </p>
            </motion.div>
          </div>
        </div>

        <section className="mt-20 rounded-sm bg-rt-navy-light px-6 py-14 md:px-10">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Years in operation" value={12} suffix="+" animateNumber borderClass="border-b-4 border-rt-navy" />
            <StatCard label="States covered" value={48} animateNumber borderClass="border-b-4 border-rt-blue" />
            <StatCard label="Loads delivered" value={18000} suffix="+" animateNumber borderClass="border-b-4 border-rt-navy-mid" />
            <StatCard label="Satisfaction rate" value={99} suffix="%" animateNumber borderClass="border-b-4 border-badge-green" />
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="font-display text-3xl font-bold text-rt-navy">Ready to work with us?</h2>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-sm bg-rt-navy px-8 py-3 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark"
          >
            Get a quote
          </Link>
        </section>
      </div>
    </div>
  );
}

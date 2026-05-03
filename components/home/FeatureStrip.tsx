"use client";

import { motion } from "framer-motion";
import { Clock, MapPinned, Truck } from "lucide-react";

const items = [
  {
    title: "Heavy-duty hauling",
    body: "Built to move oversized, high-value, and mission-critical loads.",
    icon: Truck,
  },
  {
    title: "Nationwide coverage",
    body: "Reliable transport across all 48 states.",
    icon: MapPinned,
  },
  {
    title: "24/7 dispatch",
    body: "Real people. Real-time updates. No downtime.",
    icon: Clock,
  },
];

export function FeatureStrip() {
  return (
    <section className="border-y border-rt-gray-mid bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-rt-gray-mid border-x border-rt-gray-mid md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group px-8 py-10"
          >
            <item.icon className="h-12 w-12 text-rt-navy" strokeWidth={1.25} />
            <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-wide text-rt-navy">
              {item.title}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-rt-text-mid">{item.body}</p>
            <div className="mt-6 h-0.5 w-12 bg-transparent transition-colors group-hover:bg-rt-navy" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

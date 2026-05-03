"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";

const cards = [
  {
    title: "Fleet relocation",
    body: "Move multiple vehicles efficiently with coordinated logistics.",
    img: IMG.fleetRelocation,
    alt: "Heavy equipment transport",
  },
  {
    title: "Dealership transport",
    body: "Reliable delivery for inventory, auctions, and sales transfers.",
    img: IMG.dealershipFlatbed,
    alt: "Flatbed with vehicle",
  },
  {
    title: "Jobsite delivery",
    body: "Direct-to-site transport for construction & field ops.",
    img: IMG.jobsiteSemi,
    alt: "Semi truck near shipping yard",
  },
];

export function FleetTransportCards() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h2 className="max-w-3xl font-display text-3xl text-rt-text-dark md:text-4xl">
          <span className="font-bold text-rt-navy">Full-Service</span>{" "}
          <span className="font-normal">Fleet Transport</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="flex flex-col overflow-hidden rounded-sm border border-rt-gray-mid bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image src={c.img} alt={c.alt} fill className="object-cover" sizes="400px" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-rt-navy">
                  {c.title}
                </h3>
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-rt-text-mid">
                  {c.body}
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex w-max items-center rounded-sm border-2 border-rt-navy px-4 py-2 font-body text-xs font-bold uppercase tracking-wide text-rt-navy hover:bg-rt-navy hover:text-white"
                >
                  Learn more
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

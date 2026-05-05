"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const packages = [
  {
    title: "Service Racks",
    description:
      "Maximize storage and organization on every job. Custom compartment layout, drawer systems, and locking doors built for your workflow.",
    image: "/images/service-racks.jpg",
  },
  {
    title: "Ladder Racks",
    description:
      "Secure, adjustable, and built for the long haul. Supports extension ladders, step ladders, and material loads.",
    image: "/images/ladder-racks.jpg",
  },
  {
    title: "Custom Bodies",
    description:
      "Fully custom service body fabrication from steel or aluminum. Designed around your trade, your tools, and your truck.",
    image: "/images/custom-bodies.jpg",
  },
  {
    title: "Specialty Designs",
    description:
      "One-of-a-kind upfit solutions for unique industries. If you can imagine it, we can build it.",
    image: "/images/specialty-designs.jpg",
  },
  {
    title: "Repairs & Modifications",
    description:
      "Existing upfit repairs, bracket replacements, and modifications to get your rig back in service.",
    image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200&q=80",
  },
  {
    title: "Full Custom Fabrication",
    description:
      "From concept sketches to finished steel. Full fabrication for any configuration.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80",
  },
  {
    title: "Fleet Vehicle Packages",
    description:
      "Scalable, repeatable package builds for service fleets with standardized layouts, safety gear, and deployment readiness.",
    image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=1200&q=80",
  },
  {
    title: "Crane Truck Builds",
    description:
      "Integrated crane systems with reinforced bodies, power management, and trade-specific configurations for field lifting operations.",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80",
  },
  {
    title: "Service Body Conversions",
    description:
      "Convert stock chassis into mission-ready service units with cabinetry, compressor mounts, lighting, and secure equipment zones.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
  },
  {
    title: "Custom Build Engineering",
    description:
      "From concept to CAD to production, we engineer complete one-off builds tailored to payload, trade flow, and compliance requirements.",
    image: "https://images.unsplash.com/photo-1531177071271-0b2bb37d77cb?w=1200&q=80",
  },
];

const highlights = [
  {
    title: "Specialty Bodies",
    description: "Purpose-built bodies for utility, telecom, municipal, and heavy service applications.",
  },
  {
    title: "Vehicle Upgrades",
    description: "Enhance capability, safety, and uptime with robust upfit components and systems.",
  },
  {
    title: "Custom Solutions",
    description: "Tailored fabrication and integrations designed around real-world field operations.",
  },
];

export function UpfitPackagesPage() {
  return (
    <div className="bg-[#F4F6F9]">
      <section className="relative isolate max-h-[320px] min-h-[280px] overflow-hidden bg-[#0A1628]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.07),transparent_50%),linear-gradient(to_right,rgba(10,22,40,0.95),rgba(10,22,40,0.7))]" />
        <div className="relative mx-auto flex max-w-7xl items-center px-4 py-14 md:px-6 lg:px-8">
          <div>
            <p className="font-display text-4xl font-bold italic leading-none text-white md:text-[52px]">
              OUR UPFIT
            </p>
            <p className="mt-1 font-display text-5xl font-bold italic leading-none text-[#CC1C1C] md:text-[64px]">
              PACKAGES.
            </p>
            <p className="mt-5 font-display text-lg font-medium text-white md:text-[20px]">
              Built to spec. Ready to perform.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase text-[#0A1628] md:text-4xl">
            Build Packages
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-rt-text-mid md:text-base">
            Transport-focused upfit solutions tailored for fleet vehicles, crane trucks, service bodies,
            and full custom builds.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className="overflow-hidden rounded-sm border border-[#D1D5DB] bg-white shadow-sm"
              >
                <div className="relative h-52">
                  <Image src={card.image} alt={card.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold uppercase text-[#0A1628]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-rt-text-mid">{card.description}</p>
                  <Link
                    href="/quote"
                    className="mt-5 inline-flex items-center text-xs font-bold uppercase tracking-wide text-[#CC1C1C] hover:underline"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A1628] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-3 md:px-6 lg:px-8">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-sm bg-[#E5E7EB] p-5">
              <h3 className="font-display text-lg font-bold uppercase text-[#0A1628]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#374151]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-sm border border-[#D1D5DB] md:grid-cols-2">
          <div className="relative min-h-[220px]">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80"
              alt="Fleet truck front close-up"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="bg-[#F4F6F9] p-8 md:p-10">
            <p className="font-display text-3xl font-bold uppercase text-[#0A1628]">Built For Every Mission</p>
            <p className="mt-4 text-sm leading-relaxed text-rt-text-mid md:text-base">
              Upfit your fleet for durability, efficiency, and daily use in demanding environments.
            </p>
            <Link
              href="/quote"
              className="mt-6 inline-flex rounded-sm bg-[#CC1C1C] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a61616]"
            >
              Explore Builds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { IMG } from "@/lib/images";

const phone = process.env.NEXT_PUBLIC_PHONE || "7708861016";
const phoneDisplay = "770-886-1016";

export default function ContactPage() {
  return (
    <div>
      <section className="relative min-h-[420px] w-full overflow-hidden md:min-h-[480px]">
        <Image
          src={IMG.aerialFleet}
          alt="Aerial view of commercial fleet"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/25" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-24 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Get In Touch.</h1>
            <h1 className="mt-1 font-display text-4xl font-bold text-white md:text-5xl">
              We Are Ready 24/7
            </h1>
            <p className="mt-6 font-body text-base text-white/90 md:text-lg">
              Whether you need to secure, upfit, or have a fleet delivered. We are ready 24/7 to handle
              your requests.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#talk"
                className="inline-flex rounded-sm bg-rt-navy px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-rt-navy-dark"
              >
                Request a quote
              </Link>
              <a
                href={`tel:${phone}`}
                className="inline-flex rounded-sm border-2 border-white px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-rt-navy"
              >
                Call now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="talk" className="bg-rt-gray py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-6 lg:px-8">
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl font-bold italic text-rt-navy md:text-4xl">Talk To A Pro</h2>
            <div className="mt-8 rounded-sm border border-rt-gray-mid bg-white p-6 shadow-md md:p-8">
              <ContactForm />
            </div>
          </div>
          <aside className="h-max rounded-sm border border-rt-gray-mid bg-white p-6 shadow-md">
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-rt-navy">
              Prefer direct contact?
            </h3>
            <ul className="mt-4 space-y-3 font-body text-sm text-rt-text-mid">
              <li>
                <span className="font-bold text-rt-text-dark">Phone:</span>{" "}
                <a className="text-rt-blue hover:underline" href={`tel:${phone}`}>
                  {phoneDisplay}
                </a>
              </li>
              <li>
                <span className="font-bold text-rt-text-dark">Email:</span>{" "}
                <a className="text-rt-blue hover:underline" href="mailto:dispatch@rudowtransportation.net">
                  dispatch@rudowtransportation.net
                </a>
              </li>
              <li>
                <span className="font-bold text-rt-text-dark">Address:</span> 5382 Winder Hwy, Flowery
                Branch, GA 30517
              </li>
              <li>
                <span className="font-bold text-rt-text-dark">Hours:</span> Mon–Fri: 7AM–6PM EST
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}

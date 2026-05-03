"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    quote: "On-time, professional, and easy to work with from pickup to delivery.",
    name: "Jordan M.",
    rating: 5,
  },
  {
    quote: "Our dealership transfers have never been smoother. Highly recommend.",
    name: "Alex R.",
    rating: 5,
  },
  {
    quote: "Dispatch stayed in touch the whole way. Exactly what we needed.",
    name: "Sam T.",
    rating: 5,
  },
];

export function GoogleReviews() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-bold text-rt-navy md:text-3xl">
          What customers say
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-sm border border-rt-gray-mid bg-white p-6 shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rt-navy font-display text-sm font-bold text-white">
                  G
                </span>
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-4 font-body text-sm leading-relaxed text-rt-text-mid">&ldquo;{r.quote}&rdquo;</p>
              <p className="mt-4 font-body text-sm font-semibold text-rt-navy">{r.name}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

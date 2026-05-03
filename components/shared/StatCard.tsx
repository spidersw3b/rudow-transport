"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type StatCardProps = {
  label: string;
  value: number | string;
  suffix?: string;
  borderClass?: string;
  animateNumber?: boolean;
};

export function StatCard({
  label,
  value,
  suffix = "",
  borderClass = "border-b-4 border-rt-navy",
  animateNumber = false,
}: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const num = typeof value === "number" ? value : parseInt(String(value), 10);
  const [display, setDisplay] = useState(animateNumber && !Number.isNaN(num) ? 0 : value);

  useEffect(() => {
    if (!animateNumber || Number.isNaN(num)) return;
    if (!inView) return;
    let raf: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.floor(num * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animateNumber, inView, num]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className={`rounded-sm bg-white p-5 shadow-md ${borderClass}`}
    >
      <p className="font-body text-sm font-medium uppercase tracking-wide text-rt-text-mid">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-rt-navy">
        {animateNumber && typeof value === "number" ? display : value}
        {suffix}
      </p>
    </motion.div>
  );
}

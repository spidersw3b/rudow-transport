"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { transportServices } from "@/data/transport-services";

export function ServicesAccordion() {
  const [openId, setOpenId] = useState<string | null>(transportServices[0]?.id ?? null);

  return (
    <div className="divide-y divide-rt-gray-mid">
      {transportServices.map((svc) => {
        const open = openId === svc.id;
        return (
          <div key={svc.id} className="py-2">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              onClick={() => setOpenId(open ? null : svc.id)}
              aria-expanded={open}
            >
              <span
                className={`font-body text-xl font-bold leading-snug md:text-2xl lg:text-[30px] ${
                  open ? "text-rt-navy" : "text-rt-text-dark"
                }`}
              >
                {svc.title}
              </span>
              <ChevronDown
                className={`h-6 w-6 shrink-0 text-rt-navy transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 font-body text-sm leading-relaxed text-rt-text-mid md:text-base">
                    {svc.body}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

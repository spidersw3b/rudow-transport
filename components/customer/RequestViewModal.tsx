"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TransportRequest } from "@/types";

type Props = {
  open: boolean;
  request: TransportRequest | null;
  onClose: () => void;
};

export function RequestViewModal({ open, request, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && request ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-lg font-bold text-rt-navy">{request.request_id}</p>
                <div className="mt-2">
                  <StatusBadge status={request.status} />
                </div>
              </div>
              <button type="button" onClick={onClose} className="text-rt-text-mid hover:text-rt-navy">
                ✕
              </button>
            </div>
            <dl className="mt-6 space-y-3 font-body text-sm">
              <div>
                <dt className="text-xs font-bold uppercase text-rt-text-mid">Service type</dt>
                <dd className="text-rt-text-dark">{request.service_type}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-rt-text-mid">Origin</dt>
                <dd className="text-rt-text-dark">{request.origin_location || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-rt-text-mid">Destination</dt>
                <dd className="text-rt-text-dark">{request.destination || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-rt-text-mid">Date</dt>
                <dd className="text-rt-text-dark">{new Date(request.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-rt-text-mid">Driver assigned</dt>
                <dd className="text-rt-text-dark">{request.driver_assigned || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-rt-text-mid">Tracking</dt>
                <dd className="text-rt-text-dark">{request.tracking_number || "—"}</dd>
              </div>
            </dl>
            <div className="mt-8 border-t-2 border-rt-navy pt-4">
              <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-rt-navy">
                Updates from Rudow Transportation
              </p>
              <p className="mt-2 whitespace-pre-wrap font-body text-sm text-rt-text-mid">
                {request.admin_notes?.trim() ? request.admin_notes : "No messages yet"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

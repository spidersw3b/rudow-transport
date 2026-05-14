"use client";

import { TransportQuoteForm } from "@/components/forms/TransportQuoteForm";
import { SimpleQuoteForm } from "@/components/quote/SimpleQuoteForm";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useQuoteSettings } from "@/hooks/useQuoteSettings";

export default function QuotePage() {
  const { variant, loading: variantLoading } = useQuoteSettings();

  return (
    <div className="bg-[#F4F6F9] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading eyebrow="Transport Quote" title="Request Fleet and Vehicle Transport" align="center" />
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-rt-text-mid md:text-base">
          Built for operations teams that need dependable logistics. Complete the quote wizard and our
          dispatch team will follow up with pricing and scheduling options.
        </p>
        <div className="mt-10">
          {variantLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div
                className="h-8 w-8 animate-spin rounded-full border-[3px] border-rt-gray-mid border-t-rt-navy"
                aria-label="Loading quote form"
              />
            </div>
          ) : variant === "multi-step" ? (
            <TransportQuoteForm />
          ) : (
            <SimpleQuoteForm />
          )}
        </div>
      </div>
    </div>
  );
}

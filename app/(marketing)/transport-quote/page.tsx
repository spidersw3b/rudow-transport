import { TransportQuoteForm } from "@/components/forms/TransportQuoteForm";
import { SectionHeading } from "@/components/shared/SectionHeading";

export default function TransportQuotePage() {
  return (
    <div className="bg-rt-navy-light py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Transport quote"
          title="Tell us about your move"
          align="center"
        />
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-sm text-rt-text-mid md:text-base">
          Share route, timing, and vehicle details. Our dispatch team will follow up quickly with a
          tailored plan.
        </p>
        <div className="mt-12">
          <TransportQuoteForm />
        </div>
      </div>
    </div>
  );
}

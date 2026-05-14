"use client";

import { useQuoteSettings } from "@/hooks/useQuoteSettings";

export function QuoteFormVariantPanel() {
  const { variant, loading: settingsLoading, saving: settingsSaving, updateVariant } = useQuoteSettings();

  return (
    <div className="mb-8 rounded-sm border border-rt-gray-mid bg-white p-5">
      <div className="mb-5 border-b-2 border-rt-gray pb-3">
        <h3 className="font-display text-[15px] font-bold uppercase tracking-wider text-rt-navy">Quote form</h3>
        <p className="mt-1 font-body text-xs text-rt-text-mid">
          Rudow Automotive public site — which form visitors see on <code className="rounded bg-rt-gray px-1">/quote</code>.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => !settingsSaving && updateVariant("simple")}
          disabled={settingsSaving || settingsLoading}
          className={`relative rounded-sm border-2 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
            variant === "simple" ? "border-rt-navy bg-rt-navy-light" : "border-rt-gray-mid bg-rt-gray"
          }`}
        >
          {variant === "simple" ? (
            <div className="absolute right-2.5 top-2.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-rt-navy">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
          <p className={`font-display text-sm font-bold uppercase tracking-wide ${variant === "simple" ? "text-rt-navy" : "text-rt-text-dark"}`}>
            Simple{variant === "simple" ? " (active)" : ""}
          </p>
          <p className="mt-1.5 font-body text-xs leading-snug text-rt-text-mid">
            Single-page form: contact, service, description, optional start date and photos.
          </p>
        </button>

        <button
          type="button"
          onClick={() => !settingsSaving && updateVariant("multi-step")}
          disabled={settingsSaving || settingsLoading}
          className={`relative rounded-sm border-2 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
            variant === "multi-step" ? "border-rt-navy bg-rt-navy-light" : "border-rt-gray-mid bg-rt-gray"
          }`}
        >
          {variant === "multi-step" ? (
            <div className="absolute right-2.5 top-2.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-rt-navy">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
          <p className={`font-display text-sm font-bold uppercase tracking-wide ${variant === "multi-step" ? "text-rt-navy" : "text-rt-text-dark"}`}>
            Multi-step (original){variant === "multi-step" ? " (active)" : ""}
          </p>
          <p className="mt-1.5 font-body text-xs leading-snug text-rt-text-mid">
            The original guided wizard with route fields and review step.
          </p>
        </button>
      </div>

      {settingsSaving ? (
        <p className="mt-3 flex items-center justify-center gap-2 font-body text-xs text-rt-text-mid">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-rt-gray-mid border-t-rt-navy" aria-hidden />
          Saving…
        </p>
      ) : null}

      <p className="mt-3 text-center font-body text-[11px] leading-relaxed text-rt-text-light">
        Change applies to the live /quote page. The original wizard stays in the codebase and can be restored anytime.
      </p>
    </div>
  );
}

"use client";

/**
 * Loads `quote_form_variant` from Supabase `rudow_site_settings` (anon read),
 * with GET /api/quote-form-variant as fallback. Saves via PUT (NextAuth admin).
 * Rudow Automotive public site + admin console.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export type QuoteFormVariant = "simple" | "multi-step";

const SETTINGS_KEY = "quote_form_variant";

async function loadVariantFromApi(): Promise<QuoteFormVariant> {
  try {
    const res = await fetch("/api/quote-form-variant", { method: "GET" });
    if (!res.ok) return "simple";
    const json = (await res.json()) as { variant?: string };
    return json.variant === "multi-step" ? "multi-step" : "simple";
  } catch {
    return "simple";
  }
}

export function useQuoteSettings() {
  const [variant, setVariant] = useState<QuoteFormVariant>("simple");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMounted = useRef(true);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchSettings = useCallback(async () => {
    let next: QuoteFormVariant = "simple";
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.from("rudow_site_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
      if (!error && data?.value != null && data.value !== "") {
        next = data.value === "multi-step" ? "multi-step" : "simple";
      } else {
        next = await loadVariantFromApi();
      }
    } catch {
      next = await loadVariantFromApi();
    }
    if (isMounted.current) {
      setVariant(next);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const updateVariant = useCallback(async (next: QuoteFormVariant) => {
    const previous = variantRef.current;
    if (!isMounted.current) return;
    setSaving(true);
    setVariant(next);
    try {
      const res = await fetch("/api/quote-form-variant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: next }),
        credentials: "include",
      });
      if (!res.ok && isMounted.current) {
        setVariant(previous);
      }
    } catch {
      if (isMounted.current) setVariant(previous);
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  return { variant, loading, saving, updateVariant, refetch: fetchSettings };
}

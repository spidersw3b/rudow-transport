"use client";

import { QuoteFormVariantPanel } from "@/components/admin/QuoteFormVariantPanel";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Array<{ id: string; key: string; value: Record<string, unknown> }>>([]);
  const [keyName, setKeyName] = useState("dispatch_defaults");
  const [jsonValue, setJsonValue] = useState('{"timezone":"America/New_York"}');
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (res.ok) setSettings(data.settings ?? []);
    })();
  }, []);

  return (
    <div className="max-w-2xl space-y-4">
      <QuoteFormVariantPanel />
      <h1 className="font-display text-2xl font-bold text-rt-navy">Settings</h1>
      <p className="font-body text-sm text-rt-text-mid">Read-only for admin. Super admins can persist operational defaults.</p>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-4">
        <h2 className="font-display text-lg font-bold text-rt-navy">Current settings</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {settings.map((setting) => (
            <li key={setting.id} className="rounded-sm border border-rt-gray-mid p-2">
              <p className="font-semibold">{setting.key}</p>
              <pre className="mt-1 overflow-x-auto text-xs">{JSON.stringify(setting.value, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-4">
        <h2 className="font-display text-lg font-bold text-rt-navy">Update setting</h2>
        <input className="mt-3 w-full rounded-sm border px-3 py-2 text-sm" value={keyName} onChange={(e) => setKeyName(e.target.value)} />
        <textarea className="mt-3 w-full rounded-sm border px-3 py-2 font-mono text-xs" rows={6} value={jsonValue} onChange={(e) => setJsonValue(e.target.value)} />
        <button
          type="button"
          className="mt-3 rounded-sm bg-rt-navy px-4 py-2 text-xs font-bold uppercase text-white"
          onClick={async () => {
            try {
              const parsed = JSON.parse(jsonValue) as Record<string, unknown>;
              const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: keyName, value: parsed }),
              });
              const data = await res.json();
              setMessage(res.ok ? "Saved setting." : data.error?.message ?? "Failed to save.");
            } catch {
              setMessage("Invalid JSON.");
            }
          }}
        >
          Save
        </button>
        {message ? <p className="mt-2 text-sm text-rt-text-mid">{message}</p> : null}
      </div>
    </div>
  );
}

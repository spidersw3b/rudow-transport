"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomerRequestsTable } from "@/components/customer/CustomerRequestsTable";
import { CustomerStatCards } from "@/components/customer/CustomerStatCards";
import { RequestViewModal } from "@/components/customer/RequestViewModal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import type { TransportRequest } from "@/types";

export default function ManageDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState<TransportRequest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState<TransportRequest | null>(null);
  const [docUploading, setDocUploading] = useState(false);
  const [docMessage, setDocMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/requests");
    const data = await res.json();
    if (res.ok) setRows(data.requests ?? []);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") void load();
  }, [status, session?.user?.role, load]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [status, session?.user?.role, router]);

  const stats = useMemo(() => {
    return {
      pending: rows.filter((r) => r.status === "Pending").length,
      accepted: rows.filter((r) => r.status === "Accepted").length,
      inTransit: rows.filter((r) => r.status === "In Transit").length,
      delivered: rows.filter((r) => r.status === "Delivered").length,
    };
  }, [rows]);

  async function submitDocument(file: File, requestId: string) {
    setDocMessage(null);
    setDocUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload?purpose=quote", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error?.message ?? uploadData.error ?? "Upload failed");
      const docRes = await fetch("/api/reports/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: requestId,
          file_url: uploadData.url,
          file_name: file.name,
        }),
      });
      const docData = await docRes.json();
      if (!docRes.ok) throw new Error(docData.error?.message ?? docData.error ?? "Submission failed");
      setDocMessage("Document submitted to operations.");
    } catch (submitError) {
      setDocMessage(submitError instanceof Error ? submitError.message : "Document submission failed");
    } finally {
      setDocUploading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-rt-navy-light">
        <SiteNav />
        <p className="p-8 text-sm text-rt-text-mid">Loading…</p>
      </div>
    );
  }

  if (status === "authenticated" && session?.user?.role === "admin") {
    return (
      <div className="min-h-screen bg-rt-navy-light">
        <SiteNav />
        <p className="p-8 text-sm text-rt-text-mid">Opening admin console…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rt-navy-light/50">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-body text-sm text-rt-text-mid">
              Welcome back,{" "}
              <span className="font-semibold text-rt-navy">{session?.user?.name || "Customer"}</span>
            </p>
            <p className="font-body text-xs text-rt-text-mid">{session?.user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="rounded-sm bg-rt-blue px-4 py-2 text-sm font-bold uppercase text-white hover:bg-rt-blue-dark"
            >
              New request
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-sm border border-rt-navy px-4 py-2 text-sm font-bold uppercase text-rt-navy hover:bg-rt-navy hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mt-10">
          <CustomerStatCards
            pending={stats.pending}
            accepted={stats.accepted}
            inTransit={stats.inTransit}
            delivered={stats.delivered}
          />
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-bold text-rt-navy">Your requests</h2>
          <div className="mt-4">
            <CustomerRequestsTable
              rows={rows}
              onView={(r) => {
                setActive(r);
                setModalOpen(true);
              }}
            />
          </div>
        </div>
        <div className="mt-10 rounded-sm border border-rt-gray-mid bg-white p-5">
          <h3 className="font-display text-lg font-bold text-rt-navy">Submit supporting documents</h3>
          <p className="mt-1 text-sm text-rt-text-mid">Attach customer-side files to a specific request.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              className="rounded-sm border px-3 py-2 text-sm"
              onChange={(e) => {
                const selected = rows.find((row) => row.id === e.target.value) ?? null;
                setActive(selected);
              }}
              value={active?.id ?? ""}
            >
              <option value="">Select a request</option>
              {rows.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.request_id}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*,application/pdf"
              disabled={!active || docUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file && active) {
                  void submitDocument(file, active.id);
                }
              }}
            />
          </div>
          {docMessage ? <p className="mt-3 text-sm text-rt-text-mid">{docMessage}</p> : null}
        </div>
      </div>
      <RequestViewModal open={modalOpen} request={active} onClose={() => setModalOpen(false)} />
      <SiteFooter />
    </div>
  );
}

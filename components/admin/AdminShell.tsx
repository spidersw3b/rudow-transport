"use client";

import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const { data } = useSession();

  return (
    <div className="flex min-h-screen bg-rt-navy-light/60">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-rt-gray-mid bg-white px-4 py-3 pl-14 md:px-6 lg:pl-6">
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-rt-text-mid">Admin</p>
            <p className="font-display text-lg font-bold text-rt-navy">Fleet console</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="rounded-full p-2 text-rt-text-mid hover:bg-rt-navy-light" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 rounded-sm border border-rt-gray-mid px-3 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rt-navy text-xs font-bold text-white">
                {(data?.user?.name || data?.user?.email || "A").slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <p className="font-body text-xs font-semibold text-rt-text-dark">{data?.user?.name || "Admin"}</p>
                <p className="font-body text-[10px] uppercase text-rt-text-mid">{data?.user?.role}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

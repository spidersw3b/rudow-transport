"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Menu,
  Navigation,
  Settings,
  Truck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const main = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Requests", icon: FileText, children: [{ href: "/admin/requests", label: "All requests" }] },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/drivers", label: "Drivers", icon: UserCheck },
  { href: "/admin/fleet", label: "Fleet", icon: Truck },
  { href: "/admin/routes", label: "Routes", icon: Navigation },
  { href: "/admin/reports", label: "Reports", icon: BarChart2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [openReq, setOpenReq] = useState(true);
  const [mobile, setMobile] = useState(false);

  const Nav = (
    <div className="flex h-full flex-col bg-rt-navy-dark text-white">
      <div className="border-b border-white/10 px-4 py-5">
        <p className="font-display text-lg font-bold italic">RUDOW</p>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Transportation
        </p>
        <p className="mt-2 font-body text-xs text-white/60">Fleet management</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {main.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          if (item.children) {
            return (
              <div key={item.href} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setOpenReq((o) => !o)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-rt-navy text-white" : "text-white/70 hover:bg-rt-navy-mid/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition ${openReq ? "rotate-180" : ""}`} />
                </button>
                {openReq ? (
                  <div className="ml-6 space-y-1 border-l border-white/10 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`block rounded-md px-2 py-1.5 text-xs font-medium ${
                          pathname === c.href ? "text-white" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-rt-navy text-white" : "text-white/70 hover:bg-rt-navy-mid/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-rt-navy/60 p-3">
          <p className="font-body text-xs font-semibold text-white">Need help?</p>
          <p className="mt-1 font-body text-[11px] text-white/65">Reach dispatch for account support.</p>
          <a
            href="/contact"
            className="mt-3 inline-flex w-full items-center justify-center rounded-sm border-2 border-white px-3 py-2 font-body text-xs font-bold uppercase tracking-wide text-white hover:bg-white hover:text-rt-navy"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-40 rounded-md bg-rt-navy-dark p-2 text-white lg:hidden"
        onClick={() => setMobile(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <aside className="hidden w-[220px] shrink-0 lg:block">{Nav}</aside>
      {mobile ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[240px] shadow-xl">{Nav}</div>
          <button
            type="button"
            className="flex-1 bg-black/50"
            aria-label="Close sidebar"
            onClick={() => setMobile(false)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 rounded-md bg-white p-2 text-rt-navy"
            onClick={() => setMobile(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </>
  );
}

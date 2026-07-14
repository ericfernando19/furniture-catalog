"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navSections = [
  {
    label: "Overview",
    links: [
      { href: "/admin/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
  },
  {
    label: "Kelola",
    links: [
      { href: "/admin/products", label: "Produk", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
      { href: "/admin/categories", label: "Kategori", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
      { href: "/admin/orders", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    ],
  },
  {
    label: "Insight",
    links: [
      { href: "/admin/reports", label: "Laporan", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-3 top-3 z-50 rounded-lg bg-zinc-900 p-2 text-white shadow-lg transition-all hover:bg-zinc-800 lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col bg-zinc-900 transition-transform duration-300 ease-out lg:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-[68px] items-center gap-3 border-b border-zinc-800/80 px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
              <span className="text-sm font-extrabold text-white">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold leading-tight text-white">Katalog Toko</span>
              <span className="text-[10px] font-medium leading-tight text-zinc-500">Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section, sectionIdx) => (
            <div key={section.label} className={cn(sectionIdx > 0 && "mt-6")}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setCollapsed(true)}
                      className={cn(
                        "sidebar-link",
                        isActive
                          ? "sidebar-link-active"
                          : "sidebar-link-inactive"
                      )}
                    >
                      <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                      </svg>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-zinc-800/80 p-3">
          <Link
            href="/"
            className="sidebar-link sidebar-link-inactive"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ke Website
          </Link>
          <Link
            href="/api/auth/logout"
            className="sidebar-link text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}

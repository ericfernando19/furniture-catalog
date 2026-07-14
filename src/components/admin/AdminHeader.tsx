"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Produk",
  categories: "Kategori",
  orders: "Pesanan",
  reports: "Laporan",
};

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments
    .filter((s) => s !== "admin")
    .map((segment, index) => {
      const href = `/admin/${segments.slice(1, index + 2).join("/")}`;
      const label = routeLabels[segment] || segment;
      const isLast = index === segments.length - 2;
      return { href, label, isLast };
    });

  if (crumbs.length === 0) return null;

  return (
    <nav className="hidden items-center gap-1.5 text-[13px] sm:flex">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {i > 0 && (
            <svg className="h-3 w-3 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.isLast ? (
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          A
        </div>
        <svg className={cn("h-3.5 w-3.5 text-zinc-400 transition-transform", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Admin</p>
            <p className="text-[11px] text-zinc-400">admin@katalogtoko.id</p>
          </div>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ke Website
          </Link>
          <Link href="/api/auth/logout" className="flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

export function AdminHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center border-b border-zinc-200 bg-white/80 px-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090B]/80 lg:px-6">
      <Breadcrumb />
      <div className="ml-auto flex items-center gap-1">
        <div className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900 sm:flex">
          <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[12px] text-zinc-400">Cari...</span>
          <kbd className="ml-4 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-700">⌘K</kbd>
        </div>
        <button
          onClick={toggleTheme}
          className="btn-icon"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <button className="btn-icon relative" aria-label="Notifications">
          <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { NotificationBell } from "@/components/admin/NotificationBell";

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

export function AdminHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center border-b border-zinc-200 bg-white/80 px-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090B]/80 lg:px-6">
      <Breadcrumb />
      <div className="ml-auto flex items-center gap-1">
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
        <NotificationBell />
      </div>
    </header>
  );
}

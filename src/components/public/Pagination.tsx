"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    if (searchParams) {
      for (const [key, val] of Object.entries(searchParams)) {
        if (val) params.set(key, val);
      }
    }
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Prev
        </Link>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-zinc-300 dark:text-zinc-600">...</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-150",
              page === currentPage
                ? "bg-amber-600 text-white shadow-sm shadow-amber-600/20"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            )}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Next
        </Link>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/utils";

interface NewOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  createdAt: string;
}

interface NotificationData {
  newOrders: NewOrder[];
  counts: {
    baru: number;
    diproses: number;
    selesai: number;
    dibatalkan: number;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.status === 401) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = async () => {
    if (!open) {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    }
    setOpen(!open);
  };

  const badgeCount = data?.counts.baru ?? 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="btn-icon relative"
        aria-label="Notifikasi"
      >
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {badgeCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Notifikasi</h4>
            {badgeCount > 0 && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                {badgeCount} baru
              </span>
            )}
          </div>

          {data && (
            <div className="grid grid-cols-2 gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <div className="rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-500/10">
                <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Baru</p>
                <p className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-300">{data.counts.baru}</p>
              </div>
              <div className="rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-500/10">
                <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400">Diproses</p>
                <p className="text-lg font-bold tabular-nums text-blue-700 dark:text-blue-300">{data.counts.diproses}</p>
              </div>
            </div>
          )}

          <div className="max-h-72 overflow-y-auto">
            {loading && !data ? (
              <div className="px-4 py-8 text-center text-[12px] text-zinc-400">Memuat...</div>
            ) : data?.newOrders.length === 0 ? (
              <div className="px-4 py-8 text-center text-[12px] text-zinc-400">
                Tidak ada pesanan baru.
              </div>
            ) : (
              data?.newOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                    <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">
                      Pesanan dari {order.customerName}
                    </p>
                    <p className="text-[11px] font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] text-zinc-400">
                    {timeAgo(order.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
            <Link
              href="/admin/orders"
              onClick={() => setOpen(false)}
              className="block text-center text-[12px] font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400"
            >
              Lihat semua pesanan &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

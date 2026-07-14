"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/admin/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderItem } from "@/generated/prisma/client";

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface ReportClientProps {
  orders: OrderWithItems[];
}

const statusColors: Record<string, "gold" | "warning" | "success" | "danger"> = {
  BARU: "gold",
  DIPROSES: "warning",
  SELESAI: "success",
  DIBATALKAN: "danger",
};

function generateCSV(orders: OrderWithItems[], startDate: string, endDate: string) {
  const headers = ["ID", "Pelanggan", "WhatsApp", "Alamat", "Total", "Status", "Tanggal", "Item"];
  const rows = orders.map((o) => [
    o.id,
    o.customerName,
    o.phone,
    `"${o.address.replace(/"/g, '""')}"`,
    o.totalAmount,
    o.status,
    new Date(o.createdAt).toISOString().split("T")[0],
    o.items.length,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-pesanan-${startDate || "semua"}-${endDate || "semua"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportClient({ orders }: ReportClientProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    let result = orders;
    if (startDate) {
      result = result.filter((o) => new Date(o.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      result = result.filter((o) => new Date(o.createdAt) <= end);
    }
    return result;
  }, [orders, startDate, endDate]);

  const totalFiltered = filtered.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="card-admin overflow-hidden">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Daftar Pesanan</h2>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <span className="text-zinc-300 dark:text-zinc-600">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateCSV(filtered, startDate, endDate)}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-zinc-200 bg-zinc-50/50 px-5 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/30">
        <span className="text-zinc-500 dark:text-zinc-400">
          Pesanan: <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{filtered.length}</strong>
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          Total: <strong className="font-semibold text-amber-600">{formatPrice(totalFiltered)}</strong>
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-zinc-400">
          Tidak ada data pesanan.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-admin">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-zinc-900 dark:text-zinc-100">#{order.id}</td>
                  <td className="text-zinc-900 dark:text-zinc-100">{order.customerName}</td>
                  <td className="font-semibold tabular-nums text-amber-600">{formatPrice(order.totalAmount)}</td>
                  <td><Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge></td>
                  <td className="text-zinc-500 dark:text-zinc-400">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

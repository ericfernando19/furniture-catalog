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
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-[#3E2723] dark:text-[#F5EDE0]">Daftar Pesanan</h2>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-[#3E2723] transition-all focus:border-[#8B6914] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 dark:border-gray-700 dark:bg-[#1A120B] dark:text-[#F5EDE0]"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-[#3E2723] transition-all focus:border-[#8B6914] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 dark:border-gray-700 dark:bg-[#1A120B] dark:text-[#F5EDE0]"
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

      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3 dark:border-gray-800 dark:bg-[#1A120B]">
        <div className="flex gap-6 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Pesanan: <strong className="text-[#3E2723] dark:text-[#F5EDE0]">{filtered.length}</strong>
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Total: <strong className="text-[#8B6914]">{formatPrice(totalFiltered)}</strong>
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Tidak ada data pesanan.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1A120B]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Pelanggan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-[#3E2723] dark:text-[#F5EDE0]">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-[#3E2723] dark:text-[#F5EDE0]">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#8B6914]">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4"><Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge></td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

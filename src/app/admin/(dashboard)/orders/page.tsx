import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/public/EmptyState";
import { Badge } from "@/components/admin/Badge";

export const metadata: Metadata = {
  title: "Pesanan",
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const statusColors: Record<string, "gold" | "warning" | "success" | "danger"> = {
  BARU: "gold",
  DIPROSES: "warning",
  SELESAI: "success",
  DIBATALKAN: "danger",
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const statusFilter = params.status;

  const where = statusFilter ? { status: statusFilter } : {};

  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["BARU", "DIPROSES", "SELESAI", "DIBATALKAN"];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">Pesanan</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            !statusFilter
              ? "bg-[#8B6914] text-[#3E2723] shadow-sm"
              : "border border-gray-200 text-[#4A3728] hover:border-[#8B6914] hover:text-[#8B6914] dark:border-gray-700 dark:text-gray-400"
          }`}
        >
          Semua
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              statusFilter === s
                ? "bg-[#8B6914] text-[#3E2723] shadow-sm"
                : "border border-gray-200 text-[#4A3728] hover:border-[#8B6914] hover:text-[#8B6914] dark:border-gray-700 dark:text-gray-400"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Belum ada pesanan" description="Belum ada pesanan masuk." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-[#2C1810]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{order.customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.phone}</p>
                  <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#8B6914]">{formatPrice(order.totalAmount)}</p>
                  <div className="mt-1">
                    <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {order.items.length} item
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

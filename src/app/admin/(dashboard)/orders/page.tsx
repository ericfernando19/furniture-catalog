import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/public/EmptyState";
import { Badge } from "@/components/admin/Badge";
import { cn } from "@/lib/utils";

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
      <div className="mb-6 flex flex-wrap gap-1.5">
        <Link
          href="/admin/orders"
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
            !statusFilter
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          )}
        >
          Semua
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              statusFilter === s
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Belum ada pesanan" description="Belum ada pesanan masuk." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="card-admin block p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{order.customerName}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{order.phone}</p>
                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <p className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatPrice(order.totalAmount)}
                  </p>
                  {order.shippingCost > 0 && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      +{formatPrice(order.shippingCost)} ongkir
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
                    <span className="text-xs text-zinc-400">{order.items.length} item</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await requireAdmin();

  const [totalProducts, totalOrders, totalCategories, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0] sm:text-3xl">
          Dashboard
        </h1>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Produk"
          value={totalProducts}
          color="gold"
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
        <StatsCard
          title="Total Pesanan"
          value={totalOrders}
          color="blue"
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
        <StatsCard
          title="Total Kategori"
          value={totalCategories}
          color="purple"
          icon="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="font-bold text-[#3E2723] dark:text-[#F5EDE0]">Pesanan Terbaru</h2>
        </div>
        {orders.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A120B]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Pelanggan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm font-medium text-[#3E2723] dark:text-[#F5EDE0]">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    BARU: "bg-[#8B6914]/10 text-[#8B6914]",
    DIPROSES: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    SELESAI: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    DIBATALKAN: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };
  const color = colors[status] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

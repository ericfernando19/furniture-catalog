import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { AdminChart } from "@/components/admin/AdminChart";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

const statusColors: Record<string, "gold" | "warning" | "success" | "danger"> = {
  BARU: "gold",
  DIPROSES: "warning",
  SELESAI: "success",
  DIBATALKAN: "danger",
};

export default async function DashboardPage() {
  await requireAdmin();

    const [totalProducts, totalOrders, recentOrders, revenueResult, statusCounts] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "DIBATALKAN" } },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
        where: { status: { not: "DIBATALKAN" } },
      }),
    ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  const statusMap = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]));
  const pendingOrders = (statusMap["BARU"] || 0) + (statusMap["DIPROSES"] || 0);
  const completedOrders = statusMap["SELESAI"] || 0;

  const monthlyData = [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "Mei", value: 0 },
    { label: "Jun", value: 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Selamat datang kembali. Berikut ringkasan toko Anda hari ini."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Produk"
          value={totalProducts}
          color="amber"
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          description="Produk aktif di katalog"
        />
        <StatsCard
          title="Total Pesanan"
          value={totalOrders}
          color="blue"
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          trend={pendingOrders > 0 ? { value: pendingOrders, label: "perlu diproses" } : null}
        />
        <StatsCard
          title="Selesai"
          value={completedOrders}
          color="emerald"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          description="Pesanan telah selesai"
        />
        <StatsCard
          title="Pendapatan"
          value={formatPrice(totalRevenue)}
          color="violet"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          description="Total pendapatan bersih"
        />
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AdminChart
            data={monthlyData}
            title="Pendapatan Bulanan"
            subtitle="6 bulan terakhir"
          />
        </div>
        <div className="lg:col-span-2">
          <div className="card-admin flex h-full flex-col p-5">
            <h3 className="mb-4 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Status Pesanan</h3>
            <div className="flex-1 space-y-3">
              {[
                { label: "Baru", count: statusMap["BARU"] || 0, color: "bg-amber-500" },
                { label: "Diproses", count: statusMap["DIPROSES"] || 0, color: "bg-blue-500" },
                { label: "Selesai", count: statusMap["SELESAI"] || 0, color: "bg-emerald-500" },
                { label: "Dibatalkan", count: statusMap["DIBATALKAN"] || 0, color: "bg-red-400" },
              ].map((item) => {
                const total = Math.max(pendingOrders + completedOrders + (statusMap["DIBATALKAN"] || 0), 1);
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">{item.label}</span>
                      <span className="text-[12px] font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{item.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div className={cn("h-full rounded-full transition-all duration-500", item.color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="card-admin">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 dark:border-zinc-800">
          <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Pesanan Terbaru</h3>
          <Link
            href="/admin/orders"
            className="text-[12px] font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            Lihat semua &rarr;
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-14 text-center text-[13px] text-zinc-400">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-zinc-900 dark:text-zinc-100">{order.customerName}</td>
                    <td className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td>
                      <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
                    </td>
                    <td className="text-zinc-500 dark:text-zinc-400">
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

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

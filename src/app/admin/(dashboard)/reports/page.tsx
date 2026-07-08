import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ReportClient } from "./ReportClient";

export const metadata: Metadata = {
  title: "Laporan",
};

export default async function ReportsPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">Laporan</h1>
      </div>
      <ReportClient orders={orders} />
    </div>
  );
}

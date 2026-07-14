import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
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
      <PageHeader
        title="Laporan"
        description="Ringkasan pesanan dan pendapatan."
      />
      <ReportClient orders={orders} />
    </div>
  );
}

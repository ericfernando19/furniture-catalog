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
      <ReportClient orders={orders} />
    </div>
  );
}

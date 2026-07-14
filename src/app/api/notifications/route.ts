import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const newOrders = await prisma.order.findMany({
      where: { status: "BARU" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    const counts = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });

    const statusCounts = Object.fromEntries(
      counts.map((s) => [s.status, s._count])
    );

    return NextResponse.json({
      newOrders,
      counts: {
        baru: statusCounts["BARU"] || 0,
        diproses: statusCounts["DIPROSES"] || 0,
        selesai: statusCounts["SELESAI"] || 0,
        dibatalkan: statusCounts["DIBATALKAN"] || 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

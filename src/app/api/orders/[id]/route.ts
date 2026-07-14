import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const orderId = Number(id);

    if (body.status) {
      const validStatuses = ["BARU", "DIPROSES", "SELESAI", "DIBATALKAN"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: body.status },
      });

      return NextResponse.json(order);
    }

    if (body.items || body.shippingCost !== undefined) {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!existingOrder) {
        return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
      }

      if (body.items && Array.isArray(body.items)) {
        for (const item of body.items) {
          if (item.orderItemId && typeof item.price === "number" && item.price >= 0) {
            await prisma.orderItem.update({
              where: { id: item.orderItemId },
              data: { price: item.price },
            });
          }
        }
      }

      const newShippingCost = body.shippingCost ?? existingOrder.shippingCost;

      const updatedOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!updatedOrder) {
        return NextResponse.json({ error: "Gagal mengupdate pesanan" }, { status: 500 });
      }

      const subtotal = updatedOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const totalAmount = subtotal + newShippingCost;

      await prisma.order.update({
        where: { id: orderId },
        data: { shippingCost: newShippingCost, totalAmount },
      });

      const finalOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      return NextResponse.json(finalOrder);
    }

    return NextResponse.json({ error: "Tidak ada data yang diupdate" }, { status: 400 });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Gagal mengupdate pesanan" }, { status: 500 });
  }
}

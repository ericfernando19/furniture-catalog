import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, notes, items, totalAmount } = body;

    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        notes,
        totalAmount,
        status: "BARU",
        items: {
          create: items.map((item: { productId: number; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Gagal membuat pesanan" }, { status: 500 });
  }
}

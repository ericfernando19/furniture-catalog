import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/admin/Badge";
import { OrderActions } from "./OrderActions";
import { PrintReceipt } from "./PrintReceipt";

export const metadata: Metadata = {
  title: "Detail Pesanan",
};

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, "gold" | "warning" | "success" | "danger"> = {
  BARU: "gold",
  DIPROSES: "warning",
  SELESAI: "success",
  DIBATALKAN: "danger",
};

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  await requireAdmin();
  const { id } = await params;
  const orderId = Number(id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Pesanan</p>
        <h1 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">
          Detail Pesanan #{order.id}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
            <h2 className="mb-4 font-bold text-[#3E2723] dark:text-[#F5EDE0]">Data Pembeli</h2>
            <div className="space-y-2 text-sm">
              <p className="text-[#4A3728] dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Nama:</span> {order.customerName}
              </p>
              <p className="text-[#4A3728] dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">WhatsApp:</span> {order.phone}
              </p>
              <p className="text-[#4A3728] dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Alamat:</span> {order.address}
              </p>
              {order.notes && (
                <p className="text-[#4A3728] dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-400">Catatan:</span> {order.notes}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
            <h2 className="mb-4 font-bold text-[#3E2723] dark:text-[#F5EDE0]">Pesanan</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{item.product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex justify-between">
                <span className="font-bold text-[#3E2723] dark:text-[#F5EDE0]">Total</span>
                <span className="text-lg font-bold text-[#8B6914]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
            <h2 className="mb-4 font-bold text-[#3E2723] dark:text-[#F5EDE0]">Status</h2>
            <div className="mb-4">
              <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dibuat: {formatDate(order.createdAt)}
            </p>
          </div>

          <OrderActions
            orderId={order.id}
            currentStatus={order.status}
            customerPhone={order.phone}
          />

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
            <PrintReceipt
              order={{
                id: order.id,
                customerName: order.customerName,
                phone: order.phone,
                address: order.address,
                notes: order.notes,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt.toISOString(),
                items: order.items.map((i) => ({
                  productName: i.product.name,
                  quantity: i.quantity,
                  price: i.price,
                })),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

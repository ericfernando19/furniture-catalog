import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/admin/Badge";
import { OrderActions } from "./OrderActions";
import { OrderEdit } from "./OrderEdit";
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
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="card-admin p-5">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Data Pembeli</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex">
                <span className="w-24 flex-shrink-0 text-zinc-400">Nama</span>
                <span className="text-zinc-900 dark:text-zinc-100">{order.customerName}</span>
              </div>
              <div className="flex">
                <span className="w-24 flex-shrink-0 text-zinc-400">WhatsApp</span>
                <span className="text-zinc-900 dark:text-zinc-100">{order.phone}</span>
              </div>
              <div className="flex">
                <span className="w-24 flex-shrink-0 text-zinc-400">Alamat</span>
                <span className="text-zinc-900 dark:text-zinc-100">{order.address}</span>
              </div>
              {order.notes && (
                <div className="flex">
                  <span className="w-24 flex-shrink-0 text-zinc-400">Catatan</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card-admin p-5">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Item Pesanan</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.product.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>Ongkir</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Total</span>
                <span className="text-lg font-bold tabular-nums text-amber-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-admin p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Status</h2>
            <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
          </div>

          <OrderActions
            orderId={order.id}
            currentStatus={order.status}
            customerPhone={order.phone}
          />

          <OrderEdit
            orderId={order.id}
            shippingCost={order.shippingCost}
            currentStatus={order.status}
            items={order.items.map((i) => ({
              id: i.id,
              productId: i.productId,
              product: { name: i.product.name, imageUrl: i.product.imageUrl },
              quantity: i.quantity,
              price: i.price,
              originalPrice: i.product.price,
            }))}
          />

          <div className="card-admin p-5">
            <PrintReceipt
              order={{
                id: order.id,
                customerName: order.customerName,
                phone: order.phone,
                address: order.address,
                notes: order.notes,
                totalAmount: order.totalAmount,
                shippingCost: order.shippingCost,
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

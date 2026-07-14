"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface OrderItem {
  id: number;
  productId: number;
  product: { name: string; imageUrl: string };
  quantity: number;
  price: number;
  originalPrice: number;
}

interface OrderEditProps {
  orderId: number;
  items: OrderItem[];
  shippingCost: number;
  currentStatus: string;
}

export function OrderEdit({ orderId, items, shippingCost, currentStatus }: OrderEditProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [itemPrices, setItemPrices] = useState<Record<number, number>>(
    Object.fromEntries(items.map((i) => [i.id, i.price ?? 0]))
  );
  const [shipping, setShipping] = useState(shippingCost ?? 0);

  const isDisabled = currentStatus === "SELESAI" || currentStatus === "DIBATALKAN";

  const subtotal = items.reduce((sum, i) => sum + (itemPrices[i.id] ?? i.price) * i.quantity, 0);
  const total = subtotal + shipping;

  async function handleSave() {
    setLoading(true);
    try {
      const payload = {
        shippingCost: shipping,
        items: items.map((i) => ({
          orderItemId: i.id,
          price: itemPrices[i.id] ?? i.price,
        })),
      };

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast.success("Harga dan ongkir berhasil diperbarui");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan perubahan";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-admin p-5">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Nego Harga &amp; Ongkir
      </h2>

      <div className="space-y-3">
        {items.map((item) => {
          const currentPrice = itemPrices[item.id] ?? item.price;
          const hasChanged = currentPrice !== item.originalPrice;
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.product.name}
                </p>
                <p className="text-xs text-zinc-400">
                  Harga awal: {formatPrice(item.originalPrice)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-400">Rp</span>
                <input
                  type="number"
                  min={0}
                  disabled={isDisabled}
                  value={currentPrice}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setItemPrices((prev) => ({
                      ...prev,
                      [item.id]: isNaN(val) ? 0 : val,
                    }));
                  }}
                  className={`w-28 rounded-lg border px-2 py-1.5 text-right text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                    hasChanged
                      ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Biaya Ongkir
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-400">Rp</span>
            <input
              type="number"
              min={0}
              disabled={isDisabled}
              value={shipping}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setShipping(isNaN(val) ? 0 : val);
              }}
              className="w-32 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-right text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Ongkir</span>
          <span className="tabular-nums">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-semibold text-zinc-900 dark:text-zinc-100">
          <span>Total Baru</span>
          <span className="tabular-nums text-amber-600">{formatPrice(total)}</span>
        </div>
      </div>

      {!isDisabled && (
        <div className="mt-4">
          <Button
            variant="primary"
            className="w-full"
            loading={loading}
            onClick={handleSave}
          >
            Simpan Perubahan
          </Button>
        </div>
      )}
    </div>
  );
}

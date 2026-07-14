"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/public/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

export function CartClient() {
  const { items, loaded, updateQuantity, removeItem, subtotal } = useCart();

  if (!loaded) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Keranjang kosong"
        description="Belum ada produk di keranjang Anda."
        actionLabel="Mulai Belanja"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    className="font-semibold text-zinc-900 transition-colors hover:text-amber-600 dark:text-zinc-100"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold tabular-nums text-amber-600">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400"
                    >
                      -
                    </button>
                    <span className="min-w-[2.5rem] text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-medium text-red-500 transition-colors hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="h-fit rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Ringkasan Belanja</h3>
        <div className="mt-4 space-y-2.5">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.name} <span className="text-zinc-400">x{item.quantity}</span>
              </span>
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <div className="flex justify-between">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Subtotal</span>
            <span className="text-xl font-bold tabular-nums text-amber-600">{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Link href="/checkout">
          <button className="mt-5 w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
            Lanjut ke Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

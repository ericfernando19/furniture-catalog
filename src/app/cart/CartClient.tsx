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
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
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
      <div className="space-y-4 lg:col-span-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#2C1810]"
            >
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    className="font-semibold text-[#3E2723] transition-colors hover:text-[#8B6914] dark:text-[#F5EDE0]"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-[#8B6914]">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2C1810]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-300"
                    >
                      -
                    </button>
                    <span className="min-w-[2.5rem] text-center text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
        <h3 className="text-lg font-bold text-[#3E2723] dark:text-[#F5EDE0]">Ringkasan Belanja</h3>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[#4A3728] dark:text-gray-400">
                {item.name} <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span className="font-semibold text-[#3E2723] dark:text-[#F5EDE0]">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-800">
          <div className="flex justify-between">
            <span className="font-bold text-[#3E2723] dark:text-[#F5EDE0]">Subtotal</span>
            <span className="text-xl font-bold text-[#8B6914]">{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Link href="/checkout">
          <button className="mt-6 w-full rounded-xl bg-[#8B6914] px-6 py-3 text-sm font-bold text-[#3E2723] shadow-lg shadow-[#8B6914]/20 transition-all duration-200 hover:bg-[#A0781A] active:scale-[0.98]">
            Lanjut ke Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

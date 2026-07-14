"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import type { Product } from "@/generated/prisma/client";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const toast = useToast();

  function handleAdd() {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      quantity
    );
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Jumlah:</span>
        <div className="flex items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400"
          >
            -
          </button>
          <span className="min-w-[3rem] text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-2 text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all duration-200 hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-600/25 active:scale-[0.98]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        Tambah ke Keranjang
      </button>
    </div>
  );
}

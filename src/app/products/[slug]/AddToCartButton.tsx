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
        <span className="text-sm font-semibold text-[#4A3728] dark:text-gray-300">Jumlah:</span>
        <div className="flex items-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2C1810]">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3.5 py-2 text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-300"
          >
            -
          </button>
          <span className="min-w-[3rem] text-center text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3.5 py-2 text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-[#8B6914] px-8 py-3.5 text-sm font-bold text-[#3E2723] shadow-lg shadow-[#8B6914]/25 transition-all duration-200 hover:bg-[#A0781A] active:scale-[0.98]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        Tambah ke Keranjang
      </button>
    </div>
  );
}

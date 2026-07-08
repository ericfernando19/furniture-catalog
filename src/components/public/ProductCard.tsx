"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Product } from "@/generated/prisma/client";

interface ProductCardProps {
  product: Product & { category?: { name: string } };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-[#2C1810] dark:hover:shadow-black/30">
        <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/5" />
        </Link>
        <div className="p-5">
          {product.category && (
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B6914]">
              {product.category.name}
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-[#3E2723] transition-colors group-hover:text-[#8B6914] dark:text-[#F5EDE0]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-lg font-bold text-[#8B6914]">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#3E2723] transition-all duration-200 hover:border-[#8B6914] hover:bg-[#8B6914] hover:text-[#3E2723] dark:border-gray-700 dark:bg-transparent dark:text-[#F5EDE0] dark:hover:border-[#8B6914] dark:hover:text-[#3E2723]"
          >
            Detail Produk
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

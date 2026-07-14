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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="group"
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-black/20">
        <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        <div className="p-4">
          {product.category && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600">
              {product.category.name}
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-100">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1.5 text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-all duration-150 hover:border-amber-600 hover:text-amber-600 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-300 dark:hover:border-amber-500 dark:hover:text-amber-500"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

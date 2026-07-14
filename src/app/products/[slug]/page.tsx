import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div className="container-premium py-10 sm:py-14">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400"
      >
        &larr; Kembali ke Koleksi
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 shadow-lg dark:bg-zinc-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold tabular-nums text-amber-600">{formatPrice(product.price)}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Stok:</span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {product.stock} tersedia
              </span>
            ) : (
              <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                Habis
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>

          {product.stock > 0 && (
            <AddToCartButton product={product} />
          )}
        </div>
      </div>
    </div>
  );
}

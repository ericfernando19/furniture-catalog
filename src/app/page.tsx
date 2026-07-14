import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { ProductCard } from "@/components/public/ProductCard";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/public/EmptyState";
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

async function LatestProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  if (products.length === 0) {
    return <EmptyState title="Belum ada produk" description="Produk akan segera tersedia." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}

async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    include: { category: true },
  });

  if (products.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <div className="section-divider mx-auto max-w-4xl" />

      <section className="container-premium py-14 sm:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Terbaru</p>
            <h2 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              Furniture Terbaru
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-zinc-500 transition-colors hover:text-amber-600 sm:inline-flex sm:items-center sm:gap-1"
          >
            Lihat Semua &rarr;
          </Link>
        </div>
        <Suspense fallback={
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }>
          <LatestProducts />
        </Suspense>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:border-amber-600 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-400"
          >
            Lihat Semua &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-zinc-100/50 dark:bg-zinc-900/50">
        <div className="container-premium py-14 sm:py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Pilihan</p>
              <h2 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                Furniture Unggulan
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden text-sm font-semibold text-zinc-500 transition-colors hover:text-amber-600 sm:inline-flex sm:items-center sm:gap-1"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
          <Suspense fallback={
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      <section className="container-premium py-16 text-center sm:py-20">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Siap Furnitur Rumah Anda?
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Jelajahi koleksi furniture kayu jati kami dan temukan yang sempurna untuk rumah Anda.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]"
          >
            Jelajahi Koleksi
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

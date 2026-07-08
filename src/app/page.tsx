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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="container-premium py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Terbaru</p>
            <h2 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0] sm:text-3xl">
              Furniture Terbaru
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-300"
          >
            Lihat Semua &rarr;
          </Link>
        </div>
        <Suspense fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-[#4A3728] transition-colors hover:border-[#8B6914] hover:text-[#8B6914] dark:border-gray-700 dark:text-gray-300"
          >
            Lihat Semua &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-[#1A120B]/50">
        <div className="container-premium py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Pilihan</p>
            <h2 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0] sm:text-3xl">
              Furniture Unggulan
            </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-300"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
          <Suspense fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      <section className="container-premium py-20 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0] sm:text-3xl">
            Siap Furnitur Rumah Anda?
          </h2>
          <p className="mt-3 text-[#4A3728] dark:text-gray-400">
            Jelajahi koleksi furniture kayu jati kami dan temukan yang sempurna untuk rumah Anda.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#8B6914] px-8 py-3.5 text-sm font-bold text-[#FFF8F0] shadow-lg shadow-[#8B6914]/25 transition-all duration-200 hover:bg-[#A0781A] active:scale-[0.98]"
          >
            Jelajahi Koleksi
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

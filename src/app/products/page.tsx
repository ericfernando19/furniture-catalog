import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/public/ProductCard";
import { Pagination } from "@/components/public/Pagination";
import { EmptyState } from "@/components/public/EmptyState";
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Koleksi Produk",
  description: "Jelajahi koleksi furniture kayu jati premium di MyFurni.",
};

const ITEMS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

async function ProductList({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = params.q?.trim();
  const categorySlug = params.category?.trim();
  const page = Math.max(1, Number(params.page) || 1);

  const where: Record<string, unknown> = {};

  if (q) {
    where.name = { contains: q };
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  if (products.length === 0) {
    return (
      <EmptyState
        title="Produk tidak ditemukan"
        description={q ? `Tidak ada produk dengan nama "${q}".` : "Belum ada produk yang tersedia."}
        actionLabel="Lihat Semua Produk"
        actionHref="/products"
      />
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/products"
        searchParams={{ q, category: categorySlug, page: String(page) }}
      />
    </>
  );
}

export default async function ProductsPage(props: ProductsPageProps) {
  const params = await props.searchParams;
  const q = params.q?.trim();
  const categorySlug = params.category?.trim();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-premium py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Koleksi</p>
        <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">Produk</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Jelajahi koleksi produk premium kami.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Link
            href="/products"
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              !categorySlug
                ? "bg-amber-600 text-white shadow-sm"
                : "border border-zinc-200 text-zinc-600 hover:border-amber-600 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            Semua
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                categorySlug === cat.slug
                  ? "bg-amber-600 text-white shadow-sm"
                  : "border border-zinc-200 text-zinc-600 hover:border-amber-600 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <form method="GET" action="/products" className="flex gap-2">
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari produk..."
            className="w-48 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Cari
          </button>
        </form>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ProductList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

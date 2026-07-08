import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/public/EmptyState";
import { DeleteButton } from "./DeleteButton";

export const metadata: Metadata = {
  title: "Produk",
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">Produk</h1>
        </div>
        <Link
          href="/admin/products/create"
          className="rounded-xl bg-[#8B6914] px-5 py-2.5 text-sm font-bold text-[#3E2723] shadow-sm transition-all duration-200 hover:bg-[#A0781A]"
        >
          + Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama Anda."
          actionLabel="Tambah Produk"
          actionHref="/admin/products/create"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-[#2C1810]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Produk</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Kategori</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Harga</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Stok</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-[#1A120B]">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <span className="font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{product.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {product.category.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#8B6914]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#8B6914] transition-colors hover:bg-[#8B6914]/10"
                      >
                        Edit
                      </Link>
                      <DeleteButton productId={product.id} productName={product.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

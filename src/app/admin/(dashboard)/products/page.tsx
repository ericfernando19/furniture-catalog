import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "./DeleteButton";
import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";

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
      <PageHeader
        title="Produk"
        description={`${products.length} produk terdaftar`}
        actions={<AddProductModal />}
      />

      {products.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Klik tombol Tambah Produk untuk memulai."
        />
      ) : (
        <div className="card-admin overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Tanggal</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-zinc-500 dark:text-zinc-400">{product.category.name}</td>
                    <td className="font-semibold tabular-nums text-amber-600">{formatPrice(product.price)}</td>
                    <td>
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                        product.stock > 0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="text-zinc-500 dark:text-zinc-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditProductModal productId={product.id} productName={product.name} />
                        <DeleteButton productId={product.id} productName={product.name} />
                      </div>
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

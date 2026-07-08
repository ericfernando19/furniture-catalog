import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

export default async function CreateProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">Tambah Produk</h1>
      </div>
      <div className="max-w-2xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}

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
      <div className="max-w-2xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}

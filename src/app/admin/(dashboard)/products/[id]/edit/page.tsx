import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "../../ProductForm";

export const metadata: Metadata = {
  title: "Edit Produk",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;
  const productId = Number(id);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <PageHeader title="Edit Produk" description={`Mengedit ${product.name}`} />
      <div className="max-w-2xl">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}

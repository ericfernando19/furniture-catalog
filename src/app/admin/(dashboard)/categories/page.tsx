import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryManager } from "./CategoryManager";

export const metadata: Metadata = {
  title: "Kategori",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Kategori"
        description={`${categories.length} kategori terdaftar`}
      />
      <div className="max-w-2xl">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}

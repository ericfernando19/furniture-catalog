import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
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
      <div className="max-w-2xl">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}

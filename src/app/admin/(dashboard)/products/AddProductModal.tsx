"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "./ProductForm";
import type { Category } from "@/generated/prisma/client";

export function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tambah Produk
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Produk Baru" className="max-w-xl">
        <ProductForm categories={categories} onSuccess={() => setOpen(false)} inModal />
      </Modal>
    </>
  );
}

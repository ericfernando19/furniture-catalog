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
        className="rounded-xl bg-[#8B6914] px-5 py-2.5 text-sm font-bold text-[#FFF8F0] shadow-sm transition-all duration-200 hover:bg-[#A0781A]"
      >
        + Tambah Produk
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Produk Baru">
        <div className="max-h-[70vh] overflow-y-auto">
          <ProductForm categories={categories} onSuccess={() => setOpen(false)} />
        </div>
      </Modal>
    </>
  );
}

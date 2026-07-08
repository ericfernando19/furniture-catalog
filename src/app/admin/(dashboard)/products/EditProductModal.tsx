"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "./ProductForm";
import type { Product, Category } from "@/generated/prisma/client";

interface EditProductModalProps {
  productId: number;
  productName: string;
}

export function EditProductModal({ productId, productName }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/products/${productId}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, productId]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#8B6914] transition-colors hover:bg-[#8B6914]/10"
      >
        Edit
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Edit: ${productName}`} className="max-w-xl">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <svg className="h-6 w-6 animate-spin text-[#8B6914]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          product && (
            <ProductForm categories={categories} product={product} onSuccess={() => setOpen(false)} inModal />
          )
        )}
      </Modal>
    </>
  );
}

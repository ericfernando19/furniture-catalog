"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, Category } from "@/generated/prisma/client";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
  onSuccess?: () => void;
  inModal?: boolean;
}

export function ProductForm({ categories, product, onSuccess, inModal }: ProductFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          featured: product.featured,
        }
      : {
          featured: false,
        },
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setValue("imageUrl", data.url);
      toast.success("Gambar berhasil diupload");
    } catch {
      toast.error("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: ProductInput) {
    const url = isEdit ? `/api/products/${product.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Gagal menyimpan produk");
      return;
    }

    toast.success(isEdit ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan");
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/admin/products");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={inModal ? "space-y-5" : "space-y-5"}>
      <div className={inModal ? "space-y-4" : "card-admin p-5"}>
        {!inModal && (
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isEdit ? "Edit Produk" : "Informasi Produk"}
          </h2>
        )}
        <div className="space-y-4">
          <Input
            id="name"
            label="Nama Produk"
            placeholder="Masukkan nama produk"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Masukkan deskripsi produk"
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 hover:border-zinc-300 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              label="Harga (Rp)"
              type="number"
              placeholder="100000"
              error={errors.price?.message}
              {...register("price")}
            />
            <Input
              id="stock"
              label="Stok"
              type="number"
              placeholder="10"
              error={errors.stock?.message}
              {...register("stock")}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Kategori
            </label>
            <select
              id="categoryId"
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors hover:border-zinc-300 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              {...register("categoryId")}
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm font-medium text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-600 hover:file:bg-amber-100 dark:text-zinc-400"
            />
            {uploading && <p className="text-sm text-amber-600">Mengupload...</p>}
            <input type="hidden" {...register("imageUrl")} />
            {errors.imageUrl && (
              <p className="text-sm font-medium text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
              {...register("featured")}
            />
            <label htmlFor="featured" className="text-sm text-zinc-700 dark:text-zinc-300">
              Jadikan produk unggulan
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => { if (onSuccess) onSuccess(); else router.push("/admin/products"); }}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}

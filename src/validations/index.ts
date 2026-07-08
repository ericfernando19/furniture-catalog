import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  imageUrl: z.string().min(1, "Gambar wajib diupload"),
  categoryId: z.coerce.number().min(1, "Kategori wajib dipilih"),
  featured: z.boolean().optional().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;

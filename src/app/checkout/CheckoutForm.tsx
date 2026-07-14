"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/validations";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/public/EmptyState";
import { useToast } from "@/hooks/useToast";

function generateWhatsAppMessage(data: CheckoutInput, items: { name: string; quantity: number; price: number }[], subtotal: number) {
  const lines = [
    "Halo Admin,",
    "",
    "Saya ingin memesan produk berikut:",
    "",
    ...items.map(
      (item) => `* ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ),
    "",
    `Total: ${formatPrice(subtotal)}`,
    "",
    "Data Pembeli:",
    `Nama: ${data.customerName}`,
    `WhatsApp: ${data.phone}`,
    `Alamat: ${data.address}`,
    "",
    data.notes ? `Catatan:\n${data.notes}\n` : "",
    "Terima kasih.",
  ];

  return lines.join("\n");
}

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const adminWA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "6281234567890";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const toast = useToast();

  async function onSubmit(data: CheckoutInput) {
    const message = generateWhatsAppMessage(data, items, subtotal);
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminWA}?text=${encoded}`;

    const orderPayload = {
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      notes: data.notes || "",
      totalAmount: subtotal,
      items: items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    const orderData = {
      ...data,
      items: items.map((i) => ({
        productName: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount: subtotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan pesanan");
      toast.success("Pesanan berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan pesanan ke database");
    }

    localStorage.setItem("katalog-toko-last-order", JSON.stringify(orderData));
    clearCart();
    window.open(waUrl, "_blank");
    setTimeout(() => { window.location.href = "/receipt"; }, 300);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Keranjang kosong"
        description="Tambahkan produk terlebih dahulu sebelum checkout."
        actionLabel="Lihat Produk"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 lg:col-span-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
          <h2 className="mb-5 text-lg font-bold text-[#3E2723] dark:text-[#F5EDE0]">Data Pembeli</h2>
          <div className="space-y-4">
            <Input
              id="customerName"
              label="Nama Lengkap"
              placeholder="John Doe"
              error={errors.customerName?.message}
              {...register("customerName")}
            />
            <Input
              id="phone"
              label="Nomor WhatsApp"
              placeholder="08123456789"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="space-y-1.5">
              <label htmlFor="address" className="block text-sm font-semibold text-[#4A3728] dark:text-gray-300">
                Alamat Pengiriman
              </label>
              <textarea
                id="address"
                rows={3}
                placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#3E2723] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#8B6914] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 dark:border-gray-700 dark:bg-[#2C1810] dark:text-[#F5EDE0]"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm font-medium text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="notes" className="block text-sm font-semibold text-[#4A3728] dark:text-gray-300">
                Catatan Tambahan (opsional)
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Mohon dikirim secepatnya."
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#3E2723] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#8B6914] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 dark:border-gray-700 dark:bg-[#2C1810] dark:text-[#F5EDE0]"
                {...register("notes")}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#8B6914] px-8 py-3.5 text-sm font-bold text-[#3E2723] shadow-lg shadow-[#8B6914]/25 transition-all duration-200 hover:bg-[#A0781A] active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pesan via WhatsApp
            </span>
          )}
        </button>
      </form>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#2C1810]">
          <h3 className="text-lg font-bold text-[#3E2723] dark:text-[#F5EDE0]">Ringkasan Pesanan</h3>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-800">
            <div className="flex justify-between">
              <span className="font-bold text-[#3E2723] dark:text-[#F5EDE0]">Total</span>
              <span className="text-xl font-bold text-[#8B6914]">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

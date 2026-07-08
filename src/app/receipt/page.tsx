"use client";

import { useEffect, useState } from "react";
import { Receipt } from "@/components/public/Receipt";
import { EmptyState } from "@/components/public/EmptyState";

interface ReceiptData {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: { productName: string; quantity: number; price: number }[];
  totalAmount: number;
}

export default function ReceiptPage() {
  const [data, setData] = useState<ReceiptData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("katalog-toko-last-order");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        /* empty */
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="container-premium py-20">
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-premium py-20">
        <EmptyState
          title="Belum ada pesanan"
          description="Anda belum melakukan pemesanan. Silakan lihat produk kami."
          actionLabel="Lihat Produk"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-premium py-10 sm:py-16">
      <div className="mx-auto text-center mb-8">
        <h1 className="text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">Pesanan Berhasil</h1>
        <p className="mt-2 text-sm text-[#4A3728] dark:text-gray-400">
          Pesanan Anda telah dikirim ke WhatsApp admin. Simpan struk ini sebagai bukti.
        </p>
      </div>
      <Receipt data={data} />
    </div>
  );
}

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
        <div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
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
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Pesanan Berhasil</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Pesanan Anda telah dikirim ke WhatsApp admin. Simpan struk ini sebagai bukti.
        </p>
      </div>
      <Receipt data={data} />
    </div>
  );
}

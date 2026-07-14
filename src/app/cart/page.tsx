import type { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Keranjang Belanja",
  description: "Lihat dan kelola keranjang belanja Anda.",
};

export default function CartPage() {
  return (
    <div className="container-premium py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Belanja</p>
        <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Keranjang Belanja
        </h1>
      </div>
      <CartClient />
    </div>
  );
}

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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Belanja</p>
        <h1 className="mt-1 text-3xl font-bold text-[#3E2723] dark:text-[#F5EDE0] sm:text-4xl">
          Keranjang Belanja
        </h1>
      </div>
      <CartClient />
    </div>
  );
}

import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pesanan Anda melalui WhatsApp.",
};

export default function CheckoutPage() {
  return (
    <div className="container-premium py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Pemesanan</p>
        <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}

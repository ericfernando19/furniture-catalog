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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6914]">Pemesanan</p>
        <h1 className="mt-1 text-3xl font-bold text-[#3E2723] dark:text-[#F5EDE0] sm:text-4xl">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { PublicLayout } from "@/components/PublicLayout";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MyFurni — Koleksi Furniture Premium",
    template: "%s | MyFurni",
  },
  description: "Temukan furniture kayu jati berkualitas dengan sentuhan alami dan elegan untuk rumah impian Anda.",
  keywords: ["furniture", "kayu jati", "mebel", "perabot rumah", "sofa", "meja", "kursi", "dekorasi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[#FFF8F0] text-[#3E2723] dark:bg-[#1A120B] dark:text-[#F5EDE0]">
        <ThemeProvider>
          <CartProvider>
            <PublicLayout>{children}</PublicLayout>
          </CartProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}

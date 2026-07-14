import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { PublicLayout } from "@/components/PublicLayout";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400"],
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
      className={`${jakarta.variable} ${dmSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-[#09090B] dark:text-zinc-50">
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

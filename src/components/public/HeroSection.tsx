"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-50 dark:bg-zinc-950">
      <div className="container-premium relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-600">
              Koleksi Eksklusif
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-normal leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Furniture Kayu Jati
              <span className="block text-gradient-amber">Natural &amp; Elegan</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
              Koleksi furniture kayu berkualitas tinggi dengan sentuhan alami untuk menciptakan hunian impian Anda.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all duration-200 hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-600/25 active:scale-[0.98]"
              >
                Jelajahi Koleksi
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-7 py-3 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                Lihat Katalog
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-100 shadow-2xl shadow-zinc-900/10 dark:bg-zinc-800 dark:shadow-black/30">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=1000&fit=crop&q=80"
                alt="Interior dengan furniture kayu jati"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -left-6 rounded-2xl border border-zinc-200 bg-white px-5 py-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Sejak</p>
              <p className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">2020</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

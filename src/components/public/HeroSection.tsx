"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=900&fit=crop"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A120B]/95 via-[#1A120B]/85 to-[#1A120B]/70" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #D2B48C 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />
      <div className="relative container-premium py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 inline-block rounded-full border border-[#D2B48C]/30 bg-[#D2B48C]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D2B48C] backdrop-blur-sm"
          >
            Natural Wood Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Furniture Kayu Jati
            <span className="block mt-2 text-gradient-wood">Natural & Elegan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-base text-gray-300 leading-relaxed"
          >
            Koleksi furniture kayu berkualitas tinggi dengan sentuhan alami untuk menciptakan hunian impian Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B6914] px-8 py-3.5 text-sm font-bold text-[#FFF8F0] shadow-lg shadow-[#8B6914]/25 transition-all duration-200 hover:bg-[#A0781A] hover:shadow-[#8B6914]/35 active:scale-[0.98]"
            >
              Jelajahi Koleksi
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
            >
              Lihat Katalog
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

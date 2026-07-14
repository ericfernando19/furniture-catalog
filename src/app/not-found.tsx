import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">Galat</p>
      <h1 className="mt-2 text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">Halaman tidak ditemukan</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

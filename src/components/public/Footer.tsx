import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-[#1A120B]">
      <div className="container-premium py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-[#3E2723] dark:text-[#F5EDE0]">
              My<span className="text-[#8B6914]">Furni</span>
            </h3>
            <p className="mt-2 text-sm text-[#4A3728] dark:text-gray-400 max-w-xs">
              Toko furniture kayu jati berkualitas tinggi dengan desain natural dan elegan untuk rumah impian Anda.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">Navigasi</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/products" className="text-sm text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-400">
                Koleksi Furniture
              </Link>
              <Link href="/cart" className="text-sm text-[#4A3728] transition-colors hover:text-[#8B6914] dark:text-gray-400">
                Keranjang
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">Kontak</h4>
            <p className="mt-3 text-sm text-[#4A3728] dark:text-gray-400">
              Hubungi kami melalui WhatsApp untuk konsultasi dan pemesanan furniture.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {year} MyFurni. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

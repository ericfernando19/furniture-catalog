"use client";

import { useRef } from "react";
import { formatPrice, formatDate } from "@/lib/utils";

interface ReceiptItem {
  productName: string;
  quantity: number;
  price: number;
}

interface ReceiptData {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: ReceiptItem[];
  totalAmount: number;
}

interface ReceiptProps {
  data: ReceiptData;
  orderNumber?: string;
}

export function Receipt({ data, orderNumber }: ReceiptProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pesanan - MyFurni</title>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              margin: 0;
              padding: 16px;
              color: #000;
              width: 80mm;
            }
            h1 { font-size: 18px; text-align: center; margin: 0 0 4px; }
            .sub { text-align: center; font-size: 11px; margin-bottom: 12px; color: #555; }
            hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 4px 0; text-align: left; }
            td:last-child { text-align: right; }
            .total { font-weight: bold; font-size: 14px; }
            .info { margin: 8px 0; font-size: 11px; }
            .info strong { display: inline-block; min-width: 60px; }
            .footer { text-align: center; margin-top: 12px; font-size: 10px; color: #555; }
            .order-num { text-align: center; font-size: 10px; color: #888; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          ${ref.current?.innerHTML || ""}
          <script>window.print();window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white border-2 border-dashed border-gray-300 p-6 font-mono text-sm text-black">
        <div ref={ref}>
          <h1 className="text-center text-xl font-bold tracking-tight">MyFurni</h1>
          <p className="text-center text-[10px] text-gray-500 mb-1">Koleksi Furniture Premium</p>
          {orderNumber && (
            <p className="text-center text-[10px] text-gray-400 mb-2"># {orderNumber}</p>
          )}
          <p className="text-center text-[10px] text-gray-400 mb-4">{formatDate(new Date())}</p>

          <hr className="border-dashed" />

          <div className="info my-3 text-[11px] space-y-0.5">
            <p><strong>Nama</strong> {data.customerName}</p>
            <p><strong>WA</strong> {data.phone}</p>
            <p><strong>Alamat</strong> {data.address}</p>
            {data.notes && <p><strong>Catatan</strong> {data.notes}</p>}
          </div>

          <hr className="border-dashed" />

          <table className="w-full text-[11px] mt-2">
            <thead>
              <tr className="font-semibold">
                <th className="w-[55%]">Produk</th>
                <th className="text-center w-[20%]">Qty</th>
                <th className="text-right w-[25%]">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="truncate max-w-[130px]">{item.productName}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="border-dashed" />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-bold">TOTAL</span>
            <span className="text-base font-bold">{formatPrice(data.totalAmount)}</span>
          </div>

          <hr className="border-dashed" />

          <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed">
            Terima kasih telah berbelanja<br />di MyFurni
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={handlePrint}
          className="rounded-xl bg-[#8B6914] px-6 py-3 text-sm font-bold text-[#FFF8F0] shadow-sm transition-all hover:bg-[#A0781A]"
        >
          🖨 Cetak Struk
        </button>
        <button
          onClick={() => window.location.href = "/products"}
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-[#4A3728] transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
        >
          Lanjut Belanja
        </button>
      </div>
    </div>
  );
}

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
  shippingCost?: number;
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
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 11px;
              margin: 0;
              padding: 8mm;
              color: #000;
              width: 80mm;
              line-height: 1.4;
            }
            h1 { font-size: 16px; text-align: center; margin: 0 0 2px; font-weight: bold; }
            .sub { text-align: center; font-size: 10px; margin-bottom: 8px; color: #444; }
            hr { border: none; border-top: 1px dashed #000; margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; margin: 4px 0; }
            th, td { padding: 2px 0; text-align: left; font-size: 10px; }
            th { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; }
            td:last-child { text-align: right; }
            .total-line { font-weight: bold; font-size: 13px; margin-top: 6px; }
            .info { margin: 6px 0; font-size: 10px; }
            .info p { margin: 2px 0; }
            .info strong { display: inline-block; min-width: 50px; }
            .footer { text-align: center; margin-top: 10px; font-size: 9px; color: #444; line-height: 1.5; }
            .order-num { text-align: center; font-size: 10px; color: #666; margin-bottom: 6px; }
            .date { text-align: center; font-size: 9px; color: #666; margin-bottom: 8px; }
            .product-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-6 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900">
        <div ref={ref}>
          <h1 className="text-center text-xl font-bold tracking-tight">MyFurni</h1>
          <p className="mb-1 text-center text-[10px] text-zinc-400">Koleksi Furniture Premium</p>
          {orderNumber && (
            <p className="mb-2 text-center text-[10px] text-zinc-400"># {orderNumber}</p>
          )}
          <p className="mb-4 text-center text-[9px] text-zinc-400">{formatDate(new Date())}</p>

          <hr className="border-dashed border-zinc-300" />

          <div className="my-3 space-y-0.5 text-[11px]">
            <p><strong>Nama</strong> {data.customerName}</p>
            <p><strong>WA</strong> {data.phone}</p>
            <p><strong>Alamat</strong> {data.address}</p>
            {data.notes && <p><strong>Catatan</strong> {data.notes}</p>}
          </div>

          <hr className="border-dashed border-zinc-300" />

          <table className="mt-2 w-full text-[11px]">
            <thead>
              <tr className="border-b border-zinc-900 font-semibold">
                <th className="w-[55%] text-left">Produk</th>
                <th className="w-[20%] text-center">Qty</th>
                <th className="w-[25%] text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="max-w-[120px] truncate py-1">{item.productName}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="border-dashed border-zinc-300" />

          {data.shippingCost && data.shippingCost > 0 && (
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Ongkir</span>
              <span>{formatPrice(data.shippingCost)}</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold">TOTAL</span>
            <span className="text-base font-bold">{formatPrice(data.totalAmount)}</span>
          </div>

          <hr className="border-dashed border-zinc-300" />

          <p className="mt-4 text-center text-[9px] leading-relaxed text-zinc-400">
            Terima kasih telah berbelanja<br />di MyFurni
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={handlePrint}
          className="rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700"
        >
          Cetak Struk
        </button>
        <button
          onClick={() => window.location.href = "/products"}
          className="rounded-lg border border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
        >
          Lanjut Belanja
        </button>
      </div>
    </div>
  );
}

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
    <div className="max-w-sm mx-auto">
      <div className="bg-white border-2 border-dashed border-gray-300 p-6 font-mono text-sm text-black">
        <div ref={ref}>
          <h1 className="text-center text-xl font-bold tracking-tight">MyFurni</h1>
          <p className="text-center text-[10px] text-gray-500 mb-1">Koleksi Furniture Premium</p>
          {orderNumber && (
            <p className="text-center text-[10px] text-gray-400 mb-2"># {orderNumber}</p>
          )}
          <p className="text-center text-[9px] text-gray-400 mb-4">{formatDate(new Date())}</p>

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
              <tr className="font-semibold border-b border-black">
                <th className="w-[55%] text-left">Produk</th>
                <th className="text-center w-[20%]">Qty</th>
                <th className="text-right w-[25%]">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="truncate max-w-[120px] py-1">{item.productName}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="border-dashed" />

          {data.shippingCost && data.shippingCost > 0 && (
            <div className="flex justify-between items-center mt-2 text-[11px]">
              <span className="text-gray-500">Ongkir</span>
              <span>{formatPrice(data.shippingCost)}</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-bold">TOTAL</span>
            <span className="text-base font-bold">{formatPrice(data.totalAmount)}</span>
          </div>

          <hr className="border-dashed" />

          <p className="text-center text-[9px] text-gray-400 mt-4 leading-relaxed">
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

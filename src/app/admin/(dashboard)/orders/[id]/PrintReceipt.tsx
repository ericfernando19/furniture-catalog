"use client";

import { Receipt } from "@/components/public/Receipt";

interface PrintReceiptProps {
  order: {
    id: number;
    customerName: string;
    phone: string;
    address: string;
    notes: string | null;
    totalAmount: number;
    createdAt: string;
    items: { productName: string; quantity: number; price: number }[];
  };
}

export function PrintReceipt({ order }: PrintReceiptProps) {
  const data = {
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    notes: order.notes || undefined,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      price: i.price,
    })),
    totalAmount: order.totalAmount,
  };

  return (
    <button
      onClick={() => {
        const w = window.open("", "_blank");
        if (!w) return;
        w.document.write(`
          <html><head>
            <title>Struk #${order.id} - MyFurni</title>
            <style>
              @page { margin: 0; size: 80mm auto; }
              body {
                font-family: 'Courier New', monospace; font-size: 12px;
                margin: 0; padding: 16px; color: #000; width: 80mm;
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
            </style>
          </head><body>
            <h1>MyFurni</h1>
            <p class="sub">Koleksi Furniture Premium</p>
            <p style="text-align:center;font-size:10px;color:#888;margin-bottom:8px"># ${order.id}</p>
            <p style="text-align:center;font-size:10px;color:#888;margin-bottom:12px">${new Date(order.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <hr>
            <div class="info">
              <p><strong>Nama</strong> ${order.customerName}</p>
              <p><strong>WA</strong> ${order.phone}</p>
              <p><strong>Alamat</strong> ${order.address}</p>
              ${order.notes ? `<p><strong>Catatan</strong> ${order.notes}</p>` : ""}
            </div>
            <hr>
            <table>
              <thead><tr class="font-semibold">
                <th style="width:55%">Produk</th>
                <th style="text-align:center;width:20%">Qty</th>
                <th style="text-align:right;width:25%">Total</th>
              </tr></thead>
              <tbody>
                ${order.items.map((i) => `
                  <tr>
                    <td style="max-width:130px;overflow:hidden;text-overflow:ellipsis">${i.productName}</td>
                    <td style="text-align:center">${i.quantity}</td>
                    <td style="text-align:right">${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(i.price * i.quantity)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <hr>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
              <span style="font-size:14px;font-weight:bold">TOTAL</span>
              <span style="font-size:16px;font-weight:bold">${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.totalAmount)}</span>
            </div>
            <hr>
            <p style="text-align:center;font-size:10px;color:#888;margin-top:16px;line-height:1.5">
              Terima kasih telah berbelanja<br>di MyFurni
            </p>
            <script>window.print();window.close();</script>
          </body></html>
        `);
        w.document.close();
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B6914] px-4 py-2.5 text-sm font-bold text-[#FFF8F0] transition-all hover:bg-[#A0781A]"
    >
      🖨 Cetak Struk
    </button>
  );
}

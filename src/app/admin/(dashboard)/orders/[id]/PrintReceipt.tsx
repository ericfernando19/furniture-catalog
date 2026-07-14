"use client";

interface PrintReceiptProps {
  order: {
    id: number;
    customerName: string;
    phone: string;
    address: string;
    notes: string | null;
    totalAmount: number;
    shippingCost: number;
    createdAt: string;
    items: { productName: string; quantity: number; price: number }[];
  };
}

export function PrintReceipt({ order }: PrintReceiptProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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
              .product-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            </style>
          </head><body>
            <h1>MyFurni</h1>
            <p class="sub">Koleksi Furniture Premium</p>
            <p style="text-align:center;font-size:10px;color:#666;margin-bottom:6px"># ${order.id}</p>
            <p style="text-align:center;font-size:9px;color:#666;margin-bottom:8px">${formatDate(order.createdAt)}</p>
            <hr>
            <div class="info">
              <p><strong>Nama</strong> ${order.customerName}</p>
              <p><strong>WA</strong> ${order.phone}</p>
              <p><strong>Alamat</strong> ${order.address}</p>
              ${order.notes ? `<p><strong>Catatan</strong> ${order.notes}</p>` : ""}
            </div>
            <hr>
            <table>
              <thead>
                <tr style="font-weight:bold;border-bottom:1px solid #000">
                  <th style="width:55%;text-align:left">Produk</th>
                  <th style="width:20%;text-align:center">Qty</th>
                  <th style="width:25%;text-align:right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((i) => `
                  <tr>
                    <td class="product-name" style="padding:2px 0">${i.productName}</td>
                    <td style="text-align:center;padding:2px 0">${i.quantity}</td>
                    <td style="text-align:right;padding:2px 0">${formatCurrency(i.price * i.quantity)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <hr>
            ${order.shippingCost > 0 ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:10px">
              <span style="color:#444">Ongkir</span>
              <span>${formatCurrency(order.shippingCost)}</span>
            </div>` : ""}
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
              <span style="font-size:13px;font-weight:bold">TOTAL</span>
              <span style="font-size:14px;font-weight:bold">${formatCurrency(order.totalAmount)}</span>
            </div>
            <hr>
            <p style="text-align:center;font-size:9px;color:#444;margin-top:10px;line-height:1.5">
              Terima kasih telah berbelanja<br>di MyFurni
            </p>
            <script>window.print();window.close();</script>
          </body></html>
        `);
        w.document.close();
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-amber-700"
    >
      🖨 Cetak Struk
    </button>
  );
}

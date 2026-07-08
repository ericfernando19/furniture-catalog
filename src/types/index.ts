export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
  slug: string;
}

export interface Cart {
  items: CartItem[];
}

export type OrderStatus = "BARU" | "DIPROSES" | "SELESAI" | "DIBATALKAN";

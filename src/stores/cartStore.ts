import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem["product"], quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { product_id: product.id, quantity, product }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product_id !== productId) }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
    }),
    { name: "karate-cart" },
  ),
);

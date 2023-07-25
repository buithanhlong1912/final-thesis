import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/type";
import { AlertTriangle } from "lucide-react";

interface CartStore {
  items: { data: Product; quantity: number }[];
  addItem: (data: Product, quantity: number) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  changeItemQuantity: (data: Product, quantity: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, quantity: number) => {
        const currentItems = get().items;
        const existingItem = [...currentItems].find(
          (item) => item.data?.id === data.id
        );

        if (existingItem) {
          return toast("Sản phẩm đã có ở trong giỏ hàng.");
        }

        set({ items: [...get().items, { data: data, quantity }] });
        toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.data.id !== id)] });
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
      },
      removeAll: () => set({ items: [] }),
      changeItemQuantity: (data: Product, quantity: number) => {
        const currentItems = get().items;
        const existingItem = [...currentItems].find(
          (item) => item.data?.id === data.id
        ) as {
          data: Product;
          quantity: number;
        };
        const remainingItems = [...currentItems].filter(
          (item) => item.data?.id !== data.id
        );
        if (remainingItems.length > 0) {
          set({
            items: [...remainingItems, { ...existingItem, quantity: quantity }],
          });
        } else {
          set({
            items: [{ ...existingItem, quantity: quantity }],
          });
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;

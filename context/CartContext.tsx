import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  color?: string;
  size?: string;
};

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "key">) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const makeKey = (productId: string, color?: string, size?: string) =>
    `${productId}-${color ?? "-"}-${size ?? "-"}`;

  function addToCart(item: Omit<CartItem, "key">) {
    const key = makeKey(item.productId, item.color, item.size);
    setCartItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) =>
          p.key === key ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, { ...item, key }];
    });
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((p) => (p.key === key ? { ...p, quantity } : p))
    );
  }

  function removeItem(key: string) {
    setCartItems((prev) => prev.filter((p) => p.key !== key));
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalCount = cartItems.reduce((s, it) => s + it.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      totalCount,
    }),
    [cartItems, totalCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

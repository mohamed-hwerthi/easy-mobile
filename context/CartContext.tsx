// context/CartContext.tsx
import React, { createContext, ReactNode, useContext, useReducer } from "react";

export interface CartOption {
  optionId: string;
  optionName?: string;
  optionPrice?: number;
}

export interface CartItem {
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  itemImage?: string;
  itemQuantity: number;
  itemOptions?: CartOption[];
  itemTotalPrice: number;
  productId?: string;
  variants?: string[];
  supplements?: string[];
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item.itemId === action.payload.itemId
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.itemId === action.payload.itemId
              ? {
                  ...item,
                  itemQuantity: item.itemQuantity + action.payload.itemQuantity,
                  itemTotalPrice:
                    (item.itemPrice +
                      (item.itemOptions?.reduce(
                        (sum, opt) => sum + (opt.optionPrice || 0),
                        0
                      ) || 0)) *
                    (item.itemQuantity + action.payload.itemQuantity),
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.itemId !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) => {
            if (item.itemId === action.payload.itemId) {
              const newQuantity = action.payload.quantity;
              if (newQuantity <= 0) {
                return item; // We'll handle removal separately if needed
              }

              const optionsTotal =
                item.itemOptions?.reduce(
                  (sum, opt) => sum + (opt.optionPrice || 0),
                  0
                ) || 0;

              return {
                ...item,
                itemQuantity: newQuantity,
                itemTotalPrice: (item.itemPrice + optionsTotal) * newQuantity,
              };
            }
            return item;
          })
          .filter((item) => item.itemQuantity > 0), // Remove items with quantity <= 0
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "itemTotalPrice">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = (itemData: Omit<CartItem, "itemTotalPrice">) => {
    const optionsTotal =
      itemData.itemOptions?.reduce(
        (sum, opt) => sum + (opt.optionPrice || 0),
        0
      ) || 0;

    const itemTotalPrice =
      (itemData.itemPrice + optionsTotal) * itemData.itemQuantity;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...itemData,
        itemTotalPrice,
      },
    });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.itemTotalPrice, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.itemQuantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

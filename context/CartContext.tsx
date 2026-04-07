"use client";

import { createContext, useContext, useEffect, useReducer, ReactNode, useCallback, useMemo, useRef } from "react";

// ===== DATA LAYER (pure state logic) =====

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

type Action =
  | { type: "ADD"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; payload: string }
  | { type: "INCREASE"; payload: string }
  | { type: "DECREASE"; payload: string }
  | { type: "CLEAR" }
  | { type: "SET"; payload: CartItem[] }
  | { type: "SET_QTY"; payload: { id: string; quantity: number } };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.payload);
    case "INCREASE":
      return state.map((i) =>
        i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
      );
    case "DECREASE":
      return state
        .map((i) =>
          i.id === action.payload
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);
    case "CLEAR":
      return [];
    case "SET":
      return action.payload;
    case "SET_QTY":
      return state
        .map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
    default:
      return state;
  }
}

function useCartData() {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // 🔥 Save cart to backend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.id) return;

    fetch("/api/save-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        items,
      }),
    });
  }, [items]);

  return { items, dispatch };
}

// ===== UI LAYER (actions + context) =====

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, dispatch } = useCartData();
  const lastAddRef = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    async function loadCart() {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/get-cart?user_id=${user.id}`);
        const data = await res.json();

        if (data?.items) {
          dispatch({ type: "SET", payload: data.items });
        }
      } catch (err) {
        console.error("Load cart error:", err);
      }
    }

    loadCart();
  }, [dispatch]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    const now = Date.now();

    if (
      lastAddRef.current &&
      lastAddRef.current.id === item.id &&
      now - lastAddRef.current.time < 300
    ) {
      return;
    }

    lastAddRef.current = { id: item.id, time: now };
    dispatch({ type: "ADD", payload: item });
  }, [dispatch]);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: id });
  }, []);

  const increaseQty = useCallback((id: string) => {
    dispatch({ type: "INCREASE", payload: id });
  }, []);

  const decreaseQty = useCallback((id: string) => {
    dispatch({ type: "DECREASE", payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "SET_QTY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const value = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    updateQuantity,
    clearCart,
  }), [items, addToCart, removeFromCart, increaseQty, decreaseQty, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
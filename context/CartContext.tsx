"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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
  markCheckoutCompleted: (sessionId: string) => void;
};

type Action =
  | { type: "ADD"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; payload: string }
  | { type: "INCREASE"; payload: string }
  | { type: "DECREASE"; payload: string }
  | { type: "CLEAR" }
  | { type: "SET"; payload: CartItem[] }
  | { type: "SET_QTY"; payload: { id: string; quantity: number } };

export function cartReducer(state: CartItem[], action: Action): CartItem[] {
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
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
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
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    async function sync() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session || cancelled) return;

        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
      } catch {
        // Best-effort sync
      }
    }
    sync();
    return () => {
      cancelled = true;
    };
  }, [items]);

  return { items, dispatch };
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, dispatch } = useCartData();
  const lastAddRef = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        const res = await fetch("/api/cart");
        if (!res.ok) return;
        const json = (await res.json()) as { items?: CartItem[] };
        if (json.items) dispatch({ type: "SET", payload: json.items });
      } catch {
        // ignore
      }
    }
    loadCart();
  }, [dispatch]);

  useEffect(() => {
    function onCleared() {
      dispatch({ type: "CLEAR" });
      localStorage.removeItem("cart");
    }
    window.addEventListener("cart-cleared", onCleared);
    return () => window.removeEventListener("cart-cleared", onCleared);
  }, [dispatch]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">) => {
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
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (id: string) => dispatch({ type: "REMOVE", payload: id }),
    [dispatch]
  );
  const increaseQty = useCallback(
    (id: string) => dispatch({ type: "INCREASE", payload: id }),
    [dispatch]
  );
  const decreaseQty = useCallback(
    (id: string) => dispatch({ type: "DECREASE", payload: id }),
    [dispatch]
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: "SET_QTY", payload: { id, quantity } }),
    [dispatch]
  );
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    localStorage.removeItem("cart");
  }, [dispatch]);

  const markCheckoutCompleted = useCallback(
    (sessionId: string) => {
      const key = `checkout_completed_${sessionId}`;
      if (sessionId && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
      }
      clearCart();
      window.dispatchEvent(new Event("cart-cleared"));
      void fetch("/api/cart", { method: "DELETE" }).catch(() => undefined);
    },
    [clearCart]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      updateQuantity,
      clearCart,
      markCheckoutCompleted,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      updateQuantity,
      clearCart,
      markCheckoutCompleted,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

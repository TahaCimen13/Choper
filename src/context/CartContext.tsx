"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function useCart() {
  return useContext(CartContext);
}

const STORAGE_KEY = "choper_cart";

function readLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart on mount (localStorage)
  useEffect(() => {
    setItems(readLocalCart());
    setLoaded(true);
  }, []);

  // Sync to Firestore when user logs in
  useEffect(() => {
    if (!user || !loaded) return;

    async function syncCart() {
      const ref = doc(db, "users", user!.uid, "cart", "items");
      const snap = await getDoc(ref);
      const firestoreItems: CartItem[] = snap.exists()
        ? snap.data().items ?? []
        : [];

      const localItems = readLocalCart();

      // Merge: local items take priority, add firestore items not in local
      const merged = [...localItems];
      for (const fi of firestoreItems) {
        if (!merged.find((m) => m.productId === fi.productId)) {
          merged.push(fi);
        }
      }

      setItems(merged);
      writeLocalCart(merged);
      await setDoc(ref, { items: merged });
    }

    syncCart();
  }, [user, loaded]);

  // Persist helper
  const persist = useCallback(
    (next: CartItem[]) => {
      setItems(next);
      writeLocalCart(next);
      if (user) {
        const ref = doc(db, "users", user.uid, "cart", "items");
        setDoc(ref, { items: next });
      }
    },
    [user]
  );

  function addToCart(productId: string) {
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      persist(
        items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      persist([...items, { productId, quantity: 1 }]);
    }
  }

  function removeFromCart(productId: string) {
    persist(items.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    persist(
      items.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      )
    );
  }

  function clearCart() {
    persist([]);
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

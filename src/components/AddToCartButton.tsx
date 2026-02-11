"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(productId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
        added
          ? "border border-emerald-400/40 bg-emerald-50 text-emerald-700"
          : "border border-gold/30 bg-gold/8 text-gold hover:bg-gold/15"
      }`}
    >
      {added ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Sepete Eklendi
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Sepete Ekle
        </>
      )}
    </button>
  );
}

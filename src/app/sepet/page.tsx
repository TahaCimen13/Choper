"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import products from "@/data/products.json";
import { Product } from "@/types/product";

const allProducts = products as Product[];

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

  const cartProducts = items
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as { productId: string; quantity: number; product: Product }[];

  const total = cartProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface">
            <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-3 text-2xl font-light tracking-wide text-text">
          Sepetiniz Boş
        </h1>
        <p className="mb-8 text-sm text-text-muted">
          Henüz sepetinize ürün eklemediniz. Kataloğumuzu keşfetmeye ne dersiniz?
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/8 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/15"
        >
          Kataloğa Git
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-wide text-text">Sepetim</h1>
        <button
          onClick={clearCart}
          className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-red-500"
        >
          Sepeti Temizle
        </button>
      </div>

      <div className="space-y-4">
        {cartProducts.map(({ productId, quantity, product }) => (
          <div
            key={productId}
            className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
          >
            <Link
              href={`/urun/${productId}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory-warm"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                  {product.brand}
                </span>
                <Link href={`/urun/${productId}`}>
                  <h3 className="text-sm font-medium text-text transition-colors hover:text-gold-dark">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-text-muted">{product.volume}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(productId, quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-text">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(productId, quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-text">
                    {(product.price * quantity).toLocaleString("tr-TR")} TL
                  </span>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-red-500"
                    aria-label="Ürünü kaldır"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
            Toplam
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-text">
              {total.toLocaleString("tr-TR")}
            </span>
            <span className="text-sm text-text-muted">TL</span>
          </div>
        </div>
      </div>

      <a
        href={(() => {
          const lines = cartProducts.map(
            ({ product, quantity }) =>
              `- ${product.brand} ${product.name} (${product.volume}) x${quantity} — ${(product.price * quantity).toLocaleString("tr-TR")} TL`
          );
          const message = `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n${lines.join("\n")}\n\nToplam: ${total.toLocaleString("tr-TR")} TL`;
          return `https://wa.me/905342093133?text=${encodeURIComponent(message)}`;
        })()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-[#1fb855]"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp ile Sipariş Ver
      </a>
    </div>
  );
}

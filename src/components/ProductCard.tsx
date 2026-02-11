import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

const genderLabel: Record<string, string> = {
  Erkek: "border-sky-300/40 text-sky-700/70 bg-sky-50/50",
  Kadın: "border-rose-300/40 text-rose-700/70 bg-rose-50/50",
  Unisex: "border-violet-300/40 text-violet-700/70 bg-violet-50/50",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/urun/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 hover:border-gold/30 hover:shadow-[0_8px_30px_-12px_rgba(166,139,91,0.15)]">
        <div className="relative h-60 overflow-hidden bg-ivory-warm">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
              {product.brand}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${genderLabel[product.gender]}`}
            >
              {product.gender}
            </span>
          </div>
          <h3 className="mb-1 text-sm font-medium text-text transition-colors group-hover:text-gold-dark">
            {product.name}
          </h3>
          <p className="mb-3 text-xs text-text-muted">{product.volume}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-text">
              {product.price.toLocaleString("tr-TR")}
            </span>
            <span className="text-xs text-text-muted">TL</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

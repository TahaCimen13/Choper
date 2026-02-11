import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import products from "@/data/products.json";
import { Product } from "@/types/product";
import AddToCartButton from "@/components/AddToCartButton";

const genderLabel: Record<string, string> = {
  Erkek: "border-sky-300/40 text-sky-700/70 bg-sky-50/50",
  Kadın: "border-rose-300/40 text-rose-700/70 bg-rose-50/50",
  Unisex: "border-violet-300/40 text-violet-700/70 bg-violet-50/50",
};

export function generateStaticParams() {
  return (products as Product[]).map((p) => ({ id: p.id }));
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (products as Product[]).find((p) => p.id === id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/katalog"
        className="mb-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Kataloğa Dön
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative h-80 bg-ivory-warm md:h-auto md:min-h-[560px] md:w-1/2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
            <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
              {product.brand}
            </span>
            <h1 className="mb-3 text-2xl font-light tracking-wide text-text md:text-3xl">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-medium tracking-wide ${genderLabel[product.gender]}`}
              >
                {product.gender}
              </span>
              <span className="text-xs text-text-muted">{product.volume}</span>
              <span className="text-xs text-text-muted/50">{product.category}</span>
            </div>

            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-3xl font-light text-text">
                {product.price.toLocaleString("tr-TR")}
              </span>
              <span className="text-sm text-text-muted">TL</span>
            </div>

            <div className="mb-8">
              <AddToCartButton productId={product.id} />
            </div>

            <div className="mb-8 h-px bg-border-light" />

            <p className="mb-10 text-sm font-light leading-7 text-text-secondary">
              {product.description}
            </p>

            {/* Notes */}
            <div>
              <h2 className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
                Koku Notaları
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Üst Notalar
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.ust.map((note) => (
                      <span
                        key={note}
                        className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-[10px] text-gold-dark"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Orta Notalar
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.orta.map((note) => (
                      <span
                        key={note}
                        className="rounded-full border border-rose-300/20 bg-rose-50/50 px-2.5 py-1 text-[10px] text-rose-800/60"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Alt Notalar
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.alt.map((note) => (
                      <span
                        key={note}
                        className="rounded-full border border-stone-300/30 bg-stone-100/50 px-2.5 py-1 text-[10px] text-stone-600/70"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

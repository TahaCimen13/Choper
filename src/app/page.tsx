import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";
import { Product } from "@/types/product";
import HeroSlider from "@/components/HeroSlider";

const featured = (products as Product[]).slice(0, 4);

export default function Home() {
  return (
    <div>
      {/* Hero - negative margin to slide under fixed transparent header */}
      <div className="-mt-[88px]">
        <HeroSlider />
      </div>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
            Öne Çıkanlar
          </p>
          <h2 className="text-2xl font-light tracking-wide text-text">
            Popüler Parfümler
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <Link key={product.id} href={`/urun/${product.id}`} className="group block">
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
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                    {product.brand}
                  </span>
                  <h3 className="mt-1 text-sm font-medium text-text group-hover:text-gold-dark transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-text">
                    {product.price.toLocaleString("tr-TR")} <span className="text-xs font-normal text-text-muted">TL</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-dark transition-colors hover:text-gold"
          >
            Tüm Koleksiyonu Görüntüle
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 sm:grid-cols-3">
          {[
            { title: "Orijinal Ürün", desc: "Tüm parfümlerimiz %100 orijinal ve garantilidir." },
            { title: "Ücretsiz Kargo", desc: "500 TL üzeri siparişlerde ücretsiz kargo imkanı." },
            { title: "Güvenli Alışveriş", desc: "256-bit SSL şifreleme ile güvenli ödeme." },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`px-8 py-10 text-center ${i < 2 ? "sm:border-r sm:border-border" : ""}`}
            >
              <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
                {item.title}
              </h3>
              <p className="text-xs font-light leading-relaxed text-text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

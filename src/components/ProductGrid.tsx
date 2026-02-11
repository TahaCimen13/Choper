import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 h-px w-12 bg-gold/20" />
        <p className="text-sm font-light tracking-wide text-text-secondary">
          Aradığınız kriterlere uygun ürün bulunamadı.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          Filtreleri değiştirmeyi deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

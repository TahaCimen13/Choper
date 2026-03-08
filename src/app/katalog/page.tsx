"use client";

import { useState, useMemo, useEffect } from "react";
import staticProducts from "@/data/products.json";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/products";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";

type SortOption = "price-asc" | "price-desc" | "name-az";

const initialFilters = {
  brands: [] as string[],
  genders: [] as string[],
  minPrice: "",
  maxPrice: "",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState<SortOption>("name-az");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (data.length > 0) {
          setProducts(data);
        } else {
          setProducts(staticProducts as Product[]);
        }
      } catch (err) {
        console.error("Firestore'dan ürünler yüklenemedi, JSON kullanılıyor:", err);
        setProducts(staticProducts as Product[]);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const allBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let result = products;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    if (filters.genders.length > 0) {
      result = result.filter((p) => filters.genders.includes(p.gender));
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "tr");
    });

    return result;
  }, [products, filters, sort, search]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-2xl font-light tracking-wide text-text sm:text-3xl">
          Koleksiyon
        </h1>
        <div className="mx-auto mb-4 h-px w-16 bg-gold/30" />
        <p className="text-xs font-light tracking-[0.15em] text-text-muted">
          En seçkin parfümleri keşfedin
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative sm:max-w-sm">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Parfüm adı veya marka ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-xs tracking-wide text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
        </div>
      </div>

      {loadingProducts ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-gold" />
            <p className="text-xs tracking-widest text-text-muted">YÜKLENİYOR</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-56">
            <FilterSidebar
              allBrands={allBrands}
              filters={filters}
              onFilterChange={setFilters}
              onClear={() => setFilters(initialFilters)}
            />
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs tracking-wide text-text-muted">
                <span className="font-medium text-text">
                  {filtered.length}
                </span>{" "}
                ürün bulundu
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs tracking-wide text-text-secondary focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              >
                <option value="name-az">İsim (A-Z)</option>
                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              </select>
            </div>
            <ProductGrid products={filtered} />
          </div>
        </div>
      )}
    </div>
  );
}

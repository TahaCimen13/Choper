"use client";

import { useState } from "react";

interface FilterState {
  brands: string[];
  genders: string[];
  minPrice: string;
  maxPrice: string;
}

interface FilterSidebarProps {
  allBrands: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

export default function FilterSidebar({
  allBrands,
  filters,
  onFilterChange,
  onClear,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const genderOptions = ["Erkek", "Kadın", "Unisex"];

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  const toggleGender = (gender: string) => {
    const next = filters.genders.includes(gender)
      ? filters.genders.filter((g) => g !== gender)
      : [...filters.genders, gender];
    onFilterChange({ ...filters, genders: next });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.genders.length > 0 ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  const content = (
    <div className="space-y-8">
      {/* Marka */}
      <div>
        <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
          Marka
        </h3>
        <div className="space-y-2.5">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-3 transition-colors hover:text-text"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-3.5 w-3.5 rounded-sm border-border bg-ivory accent-gold focus:ring-1 focus:ring-gold/30 focus:ring-offset-0"
              />
              <span className="text-xs font-light tracking-wide text-text-secondary">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cinsiyet */}
      <div>
        <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
          Cinsiyet
        </h3>
        <div className="space-y-2.5">
          {genderOptions.map((gender) => (
            <label
              key={gender}
              className="flex cursor-pointer items-center gap-3 transition-colors hover:text-text"
            >
              <input
                type="checkbox"
                checked={filters.genders.includes(gender)}
                onChange={() => toggleGender(gender)}
                className="h-3.5 w-3.5 rounded-sm border-border bg-ivory accent-gold focus:ring-1 focus:ring-gold/30 focus:ring-offset-0"
              />
              <span className="text-xs font-light tracking-wide text-text-secondary">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fiyat Aralığı */}
      <div>
        <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
          Fiyat Aralığı (TL)
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, minPrice: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
          <span className="text-text-muted/40">&mdash;</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, maxPrice: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
        </div>
      </div>

      {/* Temizle */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full rounded-lg border border-gold/25 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dark transition-all hover:bg-gold/8"
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary lg:hidden"
      >
        Filtreler
        <svg
          className={`h-4 w-4 text-gold transition-transform ${mobileOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-5 lg:hidden">
          {content}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{content}</div>
    </>
  );
}

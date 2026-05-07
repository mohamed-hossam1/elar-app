"use client";

import { useState } from "react";
import ProductFiltersSheet from "./ProductFiltersSheet";
import ProductResultsHeader from "./ProductResultsHeader";
import { SortOption } from "@/types/Product";
import { Category } from "@/types/Category";

interface ProductListingClientProps {
  total: number;
  currentSort: SortOption;
  categories: Category[];
  categoryName: string;
  minPrice: number;
  maxPrice: number;
}

export default function ProductListingClient({
  total,
  currentSort,
  categories,
  categoryName,
  minPrice,
  maxPrice,
}: ProductListingClientProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <>
      <ProductResultsHeader
        total={total}
        currentSort={currentSort}
        categories={categories}
        categoryName={categoryName}
        onMobileFilterOpen={() => setIsMobileFiltersOpen(true)}
      />

      <ProductFiltersSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={categories}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </>
  );
}

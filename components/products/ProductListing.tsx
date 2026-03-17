"use client";

import ProductGrid from "./ProductGrid";
import ProductListingClient from "./ProductListingClient";
import ProductPagination from "./ProductPagination";
import ProductFiltersSidebar from "./ProductFiltersSidebar";
import ProductEmptyState from "./ProductEmptyState";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AnimatedSection from "@/components/home/AnimatedSection";
import { ProductListItem, ProductListingQuery } from "@/types/Product";
import { Category } from "@/types/Category";

interface ProductListingProps {
  query: ProductListingQuery;
  products: ProductListItem[];
  total: number;
  pageCount: number;
  categories: Category[];
  catalogMin: number;
  catalogMax: number;
}

export default function ProductListing({
  query,
  products,
  total,
  pageCount,
  categories,
  catalogMin,
  catalogMax,
}: ProductListingProps) {
  const activeCategory = categories.find(c => c.slug === query.category);
  const categoryName = activeCategory ? activeCategory.title : "All Products";

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AnimatedSection>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop" }
          ]}
        />
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 border border-black p-5 sm:p-6">
            <ProductFiltersSidebar
              categories={categories}
              minPrice={catalogMin}
              maxPrice={catalogMax}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <AnimatedSection delay={0.1}>
            <div className="mb-6 sm:mb-8">
              <ProductListingClient
                total={total}
                currentSort={query.sort}
                categories={categories}
                categoryName={categoryName}
                minPrice={catalogMin}
                maxPrice={catalogMax}
              />
            </div>
          </AnimatedSection>

          <div className="min-h-[400px]">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <ProductEmptyState />
            )}
          </div>

          <AnimatedSection delay={0.2}>
            <div className="mt-12 sm:mt-16 border-t border-black pt-6">
              <ProductPagination
                currentPage={query.page}
                pageCount={pageCount}
              />
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
}

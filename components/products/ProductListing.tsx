import ProductGrid from "./ProductGrid";
import ProductListingClient from "./ProductListingClient";
import ProductPagination from "./ProductPagination";
import ProductFiltersSidebar from "./ProductFiltersSidebar";
import ProductEmptyState from "./ProductEmptyState";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getProductListing, getProductPriceRange } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";
import { ProductListingQuery } from "@/types/Product";

interface ProductListingProps {
  query: ProductListingQuery;
}


export default async function ProductListing({ query }: ProductListingProps) {
  const [listingResponse, categoriesResponse, priceRangeResponse] = await Promise.all([
    getProductListing(query),
    getAllCategories(),
    getProductPriceRange(),
  ]);

  if (!listingResponse.success || !categoriesResponse.success || !priceRangeResponse.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 font-satoshi uppercase">Unable to load products</h2>
        <p className="mt-2 text-black/60">
          We encountered an error while fetching the catalog. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const { data: products, total, pageCount } = listingResponse.data;
  const categories = categoriesResponse.data;
  const { min: catalogMin, max: catalogMax } = priceRangeResponse.data;

  
  const activeCategory = categories.find(c => c.slug === query.category);
  const categoryName = activeCategory ? activeCategory.title : "All Products";

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: "Shop" }
        ]} 
      />
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

          
          <div className="min-h-[400px]">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <ProductEmptyState />
            )}
          </div>

          
          <div className="mt-12 sm:mt-16 border-t border-black pt-6">
            <ProductPagination 
              currentPage={query.page} 
              pageCount={pageCount} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}

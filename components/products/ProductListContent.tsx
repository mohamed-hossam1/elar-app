import {
  getProductListing,
  getProductPriceRange,
} from "@/lib/queries/products";
import { getAllCategories } from "@/lib/queries/categories";
import ProductListing from "@/components/products/ProductListing";
import { normalizeListingQuery } from "@/lib/products/listing";

export default async function ProductListContent({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  const query = normalizeListingQuery(params);
  const [listingResponse, categoriesResponse, priceRangeResponse] =
    await Promise.all([
      getProductListing(query),
      getAllCategories(),
      getProductPriceRange(),
    ]);

  if (
    !listingResponse.success ||
    !categoriesResponse.success ||
    !priceRangeResponse.success
  ) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <h2 className="font-satoshi text-2xl font-bold uppercase text-gray-900">
          Unable to load products
        </h2>
        <p className="mt-2 text-black/60">
          We encountered an error while fetching the catalog. Please try
          refreshing the page.
        </p>
      </div>
    );
  }

  const { data: products, total, pageCount } = listingResponse.data;
  const categories = categoriesResponse.data;
  const { min: catalogMin, max: catalogMax } = priceRangeResponse.data;

  return (
    <ProductListing
      query={query}
      products={products}
      total={total}
      pageCount={pageCount}
      categories={categories}
      catalogMin={catalogMin}
      catalogMax={catalogMax}
    />
  );
}

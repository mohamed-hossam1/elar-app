"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProductListing, getProductPriceRange } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";
import ProductListing from "@/components/products/ProductListing";
import ShowProductsListSkeleton from "@/components/skeleton/ShowProductsListSkeleton";
import { normalizeListingQuery } from "@/lib/products/listing";

export default function ProductListContent() {
  const searchParams = useSearchParams();

  const query = useMemo(
    () => normalizeListingQuery(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["products-page", query],
    queryFn: async () => {
      const [listingResponse, categoriesResponse, priceRangeResponse] =
        await Promise.all([
          getProductListing(query),
          getAllCategories(),
          getProductPriceRange(),
        ]);

      return {
        listingResponse,
        categoriesResponse,
        priceRangeResponse,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <ShowProductsListSkeleton />;
  }

  if (
    !data ||
    !data.listingResponse.success ||
    !data.categoriesResponse.success ||
    !data.priceRangeResponse.success
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

  const { data: products, total, pageCount } = data.listingResponse.data;
  const categories = data.categoriesResponse.data;
  const { min: catalogMin, max: catalogMax } = data.priceRangeResponse.data;

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

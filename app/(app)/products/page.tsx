import ProductListing from "@/components/products/ProductListing";
import { normalizeListingQuery } from "@/lib/products/listing";
import { Suspense } from "react";
import ShowProductsListSkeleton from "@/components/skeleton/ShowProductsListSkeleton";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import {
  getOgMetadata,
  getTwitterCardMetadata,
} from "@/lib/metadata/socialCards";
import { getBreadcrumbSchema } from "@/lib/metadata/structuredData";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Explore our full collection of premium men's clothing. From t-shirts to shirts and pants, find your next favorite outfit at ELAR Egypt.",
  alternates: {
    canonical: getCanonicalUrl("/products"),
  },
  openGraph: getOgMetadata(
    "Shop All Products | ELAR",
    "Explore our full collection of premium men's clothing. From t-shirts to shirts and pants, find your next favorite outfit at ELAR Egypt.",
    "/products",
  ),
  twitter: getTwitterCardMetadata(
    "Shop All Products | ELAR",
    "Explore our full collection of premium men's clothing. From t-shirts to shirts and pants, find your next favorite outfit at ELAR Egypt.",
  ),
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<ShowProductsListSkeleton />}>
        <ProductsWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ProductsWrapper({
  searchParams,
}: {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const normalizedQuery = normalizeListingQuery(params);
  return <ProductListing query={normalizedQuery} />;
}

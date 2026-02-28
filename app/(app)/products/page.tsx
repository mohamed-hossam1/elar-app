import ProductListContent from "@/components/products/ProductListContent";
import { Metadata } from "next";
import { Suspense } from "react";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import {
  getOgMetadata,
  getTwitterCardMetadata,
} from "@/lib/metadata/socialCards";
import { getBreadcrumbSchema } from "@/lib/metadata/structuredData";
import ShowProductsListSkeleton from "@/components/skeleton/ShowProductsListSkeleton";

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

export default function ProductsPage() {
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
        <ProductListContent />
      </Suspense>
    </>
  );
}

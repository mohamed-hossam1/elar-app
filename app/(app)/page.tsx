import Hero from "@/components/home/Hero";
import Reviews from "@/components/home/Reviews";
import { Suspense } from "react";
import NewArrivalsWrapper from "@/components/home/NewArrivalsWrapper";
import TopSellingWrapper from "@/components/home/TopSellingWrapper";
import CategoriesWrapper from "@/components/home/CategoriesWrapper";
import {
  CategoriesSkeleton,
  ProductSectionSkeleton,
} from "@/components/home/HomeSkeletons";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import { getOgMetadata, getTwitterCardMetadata } from "@/lib/metadata/socialCards";

export const metadata: Metadata = {
  title: "ELAR | Premium Men's Fashion in Egypt",
  description:
    "Shop high-quality men's clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: getOgMetadata(
    "ELAR | Premium Men's Fashion in Egypt",
    "Shop high-quality men's clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt.",
    "/"
  ),
  twitter: getTwitterCardMetadata(
    "ELAR | Premium Men's Fashion in Egypt",
    "Shop high-quality men's clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt."
  ),
};

export default function Home() {
  return (
    <main>
      <Hero />

      <Suspense fallback={<ProductSectionSkeleton title="NEW ARRIVALS" />}>
        <NewArrivalsWrapper />
      </Suspense>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-black/10" />
      </div>

      <Suspense fallback={<ProductSectionSkeleton title="TOP SELLING" />}>
        <TopSellingWrapper />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesWrapper />
      </Suspense>

      <Reviews />
    </main>
  );
}


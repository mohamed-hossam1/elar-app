import { getTopSelling } from "@/lib/queries/products";
import ProductSection from "@/components/home/ProductSection";
import ROUTES from "@/constants/routes";
import EmptyState from "@/components/ui/EmptyState";

export default async function TopSellingWrapper() {
  const topSellingRes = await getTopSelling(5);
  const topSelling =
    topSellingRes.success && topSellingRes.data ? topSellingRes.data : [];

  if (topSelling.length === 0) {
    return (
      <section className="container mx-auto px-4 md:px-6 py-8 sm:py-12 lg:py-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-8 sm:mb-12 text-center uppercase tracking-tighter font-integral">
          TOP SELLING
        </h2>
        <EmptyState 
          title="NO TOP SELLERS YET" 
          message="We are currently gathering data on our most popular items. Check back soon!"
        />
      </section>
    );
  }

  return (
    <ProductSection
      title="TOP SELLING"
      products={topSelling}
      viewAllLink={ROUTES.TOP_SELLING}
    />
  );
}


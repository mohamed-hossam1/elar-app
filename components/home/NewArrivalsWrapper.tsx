import { getNewArrivals } from "@/lib/queries/products";
import ProductSection from "@/components/home/ProductSection";
import ROUTES from "@/constants/routes";
import EmptyState from "@/components/ui/EmptyState";

export default async function NewArrivalsWrapper() {
  const newArrivalsRes = await getNewArrivals();
  const newArrivals =
    newArrivalsRes.success && newArrivalsRes.data ? newArrivalsRes.data : [];

  if (newArrivals.length === 0) {
    return (
      <section className="container mx-auto px-4 md:px-6 py-8 sm:py-12 lg:py-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-8 sm:mb-12 text-center uppercase tracking-tighter font-integral">
          NEW ARRIVALS
        </h2>
        <EmptyState 
          title="NO NEW ARRIVALS YET" 
          message="We are currently restocking our latest collection. Check back soon for exciting new products!"
        />
      </section>
    );
  }

  return (
    <ProductSection
      title="NEW ARRIVALS"
      products={newArrivals}
      viewAllLink={ROUTES.NEW_ARRIVALS}
      priority={true}
    />
  );
}

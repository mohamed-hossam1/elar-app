import { getNewArrivals } from "@/actions/productsAction";
import ProductSection from "@/components/home/ProductSection";
import ROUTES from "@/constants/routes";

export default async function NewArrivalsWrapper() {
  const newArrivalsRes = await getNewArrivals(10);
  const newArrivals =
    newArrivalsRes.success && newArrivalsRes.data ? newArrivalsRes.data : [];

  if (newArrivals.length === 0) return null;

  return (
    <ProductSection
      title="NEW ARRIVALS"
      products={newArrivals}
      viewAllLink={ROUTES.NEW_ARRIVALS}
      priority={true}
    />
  );
}

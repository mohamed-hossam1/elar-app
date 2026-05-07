import { ProductListItem } from "@/types/Product";
import ProductCard from "../ProductCard";
import Link from "next/link";

interface ProductSectionProps {
  title: string;
  products: ProductListItem[];
  viewAllLink: string;
  priority?: boolean;
}

export default function ProductSection({
  title,
  products,
  viewAllLink,
  priority = false,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  const displayedProducts = products.slice(0, 8);

  return (
    <section className="w-full py-12 sm:py-18 lg:py-20 bg-white border-b border-black/10 last:border-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-integral font-black text-left mb-8 sm:mb-12 lg:mb-14 tracking-[0.04em] leading-[1.02]">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-14">
          {displayedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={priority && index < 4}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href={viewAllLink}
            className="px-12 sm:px-14 py-3 sm:py-4 border border-black rounded-none bg-white text-black hover:bg-black hover:text-white active:translate-y-0.5 uppercase tracking-widest text-sm font-bold transition-colors w-full sm:w-fit text-center"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}

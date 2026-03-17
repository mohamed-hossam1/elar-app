import { ProductListItem } from "@/types/Product";
import ProductCard from "../ProductCard";
import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import * as motion from "motion/react-client"

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
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-integral font-black text-left mb-8 sm:mb-12 lg:mb-14 tracking-[0.04em] leading-[1.02]">
            {title}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-14">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.25, 0.1, 0.25, 1] as const,
              }}
            >
              <ProductCard
                product={product}
                priority={priority && index < 4}
              />
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="flex justify-center">
            <Link
              href={viewAllLink}
              className="group relative inline-block px-12 sm:px-14 py-3 sm:py-4 border border-black rounded-none bg-white text-black uppercase tracking-widest text-sm font-bold w-full sm:w-fit text-center overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                View All
              </span>
              <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

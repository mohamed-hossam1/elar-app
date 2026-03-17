import { ProductListItem } from "@/types/Product";
import ProductCard from "@/components/ProductCard";
import * as motion from "motion/react-client"

interface ProductGridProps {
  products: ProductListItem[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{
            duration: 0.45,
            delay: index * 0.05,
            ease: [0.25, 0.1, 0.25, 1] as const,
          }}
        >
          <ProductCard product={product} priority={index < 4} />
        </motion.div>
      ))}
    </div>
  );
}

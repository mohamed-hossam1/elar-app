import { ProductListItem } from "@/types/Product";
import ProductCard from "../ProductCard";
import * as motion from "motion/react-client";

interface CardListProp {
  products: ProductListItem[] | [];
}

export default function CardList({ products }: CardListProp) {
  return (
    <div className="relative">
      <div className="flex overflow-auto custom-scroll mb-10 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="w-[180px] sm:w-[240px] md:w-60 shrink-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
              ease: [0.25, 0.1, 0.25, 1] as const,
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

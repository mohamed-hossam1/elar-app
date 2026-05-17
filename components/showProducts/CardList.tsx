import { ProductListItem } from "@/types/Product";
import ProductCard from "../ProductCard";

interface CardListProp {
  products: ProductListItem[] | [];
}

export default function CardList({ products }: CardListProp) {
  return (
    <div className="relative">
      <div className="flex overflow-auto custom-scroll mb-10 gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="w-[180px] sm:w-[240px] md:w-60 shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

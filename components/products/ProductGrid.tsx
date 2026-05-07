import { ProductListItem } from "@/types/Product";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: ProductListItem[];
}


export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          
          priority={index < 4} 
        />
      ))}
    </div>
  );
}

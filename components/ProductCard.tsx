import { ProductListItem } from "@/types/Product";
import Image from "@/components/imageKit/ImageOptimization";
import Link from "next/link";
import { egpFormatter } from "@/lib/format/currency";


export default function ProductCard({
  product,  
  priority = false,
}: {
  product: ProductListItem;
  priority?: boolean;
}) {
  const title = product.title?.trim() || "Untitled product";
  const currentPrice = Number.isFinite(product.min_price)
    ? product.min_price
    : 0;
  const beforePrice = Number.isFinite(product.min_price_before)
    ? product.min_price_before
    : 0;
  const hasDiscount = beforePrice > currentPrice && beforePrice > 0;
  const discount = hasDiscount
    ? Math.max(
        1,
        Math.min(
          99,
          Math.round(((beforePrice - currentPrice) / beforePrice) * 100),
        ),
      )
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col h-full w-full bg-white border border-transparent hover:border-black active:translate-y-0.5 transition-colors p-2 sm:p-3"
    >
      <div className="relative w-full pb-[125%] bg-white border border-black overflow-hidden shrink-0">
        <Image
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          src={product.image_cover || "/images/default-fallback.png"}
          alt={title}
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />
      </div>

      <div className="flex flex-col mt-3 flex-1">
        <h3 className="font-satoshi font-bold text-sm sm:text-lg line-clamp-1 uppercase tracking-[0.02em] min-h-8 sm:min-h-10 leading-tight break-words">
          {title}
        </h3>

        <div className="flex flex-col gap-0.5 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black font-satoshi">
              {egpFormatter.format(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                -{discount}%
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-xs sm:text-sm font-bold font-satoshi text-black/60 line-through">
              {egpFormatter.format(beforePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

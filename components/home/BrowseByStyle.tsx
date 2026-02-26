import Image from "@/components/imageKit/ImageOptimization";
import Link from "next/link";
import { Category } from "@/types/Category";

export default function BrowseByStyle({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-14 sm:mb-16">
      <div className="max-w-[1400px] mx-auto bg-white border border-black p-8 sm:p-12 lg:p-14">
        <h2 className="text-3xl sm:text-5xl font-integral font-black text-center mb-10 sm:mb-14 tracking-[0.04em] uppercase leading-[1.02]">
          BROWSE BY DRESS STYLE
        </h2>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-12 sm:gap-y-14 lg:gap-x-16">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="group flex flex-col items-center transition-transform duration-300 hover:-translate-y-1 active:translate-y-0.5"
            >
              <div className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border border-black overflow-hidden bg-white mb-4 sm:mb-5 transition-colors group-hover:border-black/70">
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 112px, (max-width: 1200px) 160px, 192px"
                    priority={index < 4}
                  />
                )}
                {!category.image && (
                  <div className="absolute inset-0 flex items-center justify-center text-black/50 text-xs sm:text-sm font-satoshi font-bold uppercase tracking-[0.08em] px-3 text-center">
                    {category.title}
                  </div>
                )}
              </div>
              <span className="text-sm sm:text-base lg:text-lg font-black font-integral uppercase text-center tracking-[0.08em] max-w-[140px] sm:max-w-[180px] leading-tight wrap-break-word line-clamp-2">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

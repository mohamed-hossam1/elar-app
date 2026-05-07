import Image from "@/components/imageKit/ImageOptimization";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default function Hero() {
  return (
    <section className="bg-hero-background w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 lg:gap-10">
          <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-6 lg:gap-7 py-8 sm:py-12 md:py-16 lg:py-22 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-integral font-black tracking-[0.04em] leading-[1.08] sm:leading-[1.02] lg:leading-[0.98]">
              FIND CLOTHES
              <br /> THAT MATCH
              <br /> YOUR STYLE
            </h1>

            <p className="text-sm sm:text-base text-black/70 font-satoshi leading-relaxed max-w-[62ch]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>

            <div className="pt-2 sm:pt-4">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-block w-full sm:w-auto bg-black text-white px-12 sm:px-14 py-4 border border-black rounded-none uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black active:translate-y-0.5 transition-colors text-center"
              >
                Shop Now
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-8 lg:mt-10 pt-5 sm:pt-6 border-t border-black/10">
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-satoshi leading-tight">
                  200+
                </span>
                <span className="text-xs sm:text-sm text-black/70 font-satoshi leading-tight">
                  Brands
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-satoshi leading-tight">
                  2K+
                </span>
                <span className="text-xs sm:text-sm text-black/70 font-satoshi leading-tight">
                  Products
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-satoshi leading-tight">
                  30K+
                </span>
                <span className="text-xs sm:text-sm text-black/70 font-satoshi leading-tight">
                  Happy Customers
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-full md:w-1/2 relative justify-center md:justify-end pb-6 lg:pb-0">
            <div className="relative w-full aspect-square max-w-[660px]">
              <Image
                src="/hero_image.webp"
                alt="Fashion collection - stylish clothing"
                sizes="(min-width: 768px) 50vw, 0px"
                fill
                className="object-contain object-bottom"
                priority
              />

              <div className="absolute top-[45%] left-[-30px] lg:-left-10 w-11 h-11 lg:w-14 lg:h-14 animate-spin-slow z-0 hidden lg:block">
                <Image
                  src="/star2.webp"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 animate-spin-slow z-0 hidden lg:block">
                <Image
                  src="/star1.webp"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

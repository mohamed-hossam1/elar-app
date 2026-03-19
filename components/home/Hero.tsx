import Image from "@/components/imageKit/ImageOptimization";
import Link from "next/link";
import ROUTES from "@/constants/routes";

import AnimatedCounter from "./AnimatedCounter";

export default function Hero() {
  return (
    <section className="relative bg-hero-background w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.03] animate-gradient-shift bg-[length:200%_200%] pointer-events-none" />

      <div className="absolute top-12 left-1/4 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-8 right-1/3 w-48 h-48 bg-white/20 rounded-full blur-2xl animate-pulse-soft pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 lg:gap-10">
          <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-6 lg:gap-7 py-8 sm:py-12 md:py-16 lg:py-22 z-10">
            <h1 className="animate-hero-fade-up hero-delay-1 text-4xl sm:text-5xl lg:text-[64px] font-integral font-black tracking-[0.04em] leading-[1.08] sm:leading-[1.02] lg:leading-[0.98]">
              <span>FIND CLOTHES</span>
              <br />
              <span>THAT MATCH</span>
              <br />
              <span className="relative inline-block">
                YOUR STYLE
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-black/20 rounded-full" />
              </span>
            </h1>

            <p className="animate-hero-fade-up hero-delay-2 text-sm sm:text-base text-black/70 font-satoshi leading-relaxed max-w-[62ch]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>

            <div className="animate-hero-fade-up hero-delay-3 pt-2 sm:pt-4">
              <Link
                href={ROUTES.PRODUCTS}
                className="group relative inline-block w-full sm:w-auto bg-black text-white px-12 sm:px-14 py-4 border border-black rounded-none uppercase tracking-widest text-sm font-bold text-center overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                  Shop Now
                </span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </div>

            <div className="animate-hero-fade-up hero-delay-4 grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-8 lg:mt-10 pt-5 sm:pt-6 border-t border-black/10">
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-satoshi leading-tight tabular-nums">
                  <AnimatedCounter to={200} suffix="+" />
                </span>
                <span className="text-xs sm:text-sm text-black/70 font-satoshi leading-tight">
                  Brands
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-satoshi leading-tight tabular-nums">
                  <AnimatedCounter to={2000} suffix="+" />
                </span>
                <span className="text-xs sm:text-sm text-black/70 font-satoshi leading-tight">
                  Products
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-satoshi leading-tight tabular-nums">
                  <AnimatedCounter to={30000} suffix="+" />
                </span>
                <span className="text-xs sm:text-sm text-black/70 font-satoshi leading-tight">
                  Happy Customers
                </span>
              </div>
            </div>
          </div>

          <div className="max-md:fixed max-md:-top-full max-md:opacity-0 md:relative md:flex w-full md:w-1/2 justify-center md:justify-end pb-6 lg:pb-0">
            <div className="animate-hero-scale-in relative w-full aspect-square max-w-[660px]">
              <div className="absolute -inset-4 bg-gradient-to-br from-black/[0.03] via-transparent to-black/[0.03] rounded-full blur-2xl animate-spin-slow" />

              <Image
                src="/hero_image.webp"
                alt="Fashion collection - stylish clothing"
                sizes="(min-width: 768px) 50vw, 100vw"
                fill
                className="object-contain object-bottom"
                priority
                fetchPriority="high"
              />

              <div className="absolute top-[42%] -left-8 lg:-left-12 w-11 h-11 lg:w-14 lg:h-14 z-10 animate-hero-float-2">
                <Image
                  src="/star2.webp"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>

              <div className="absolute top-0 right-4 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 z-10 animate-hero-float-1">
                <Image
                  src="/star1.webp"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>

              <div className="absolute bottom-[15%] -right-6 w-8 h-8 lg:w-10 lg:h-10 z-10 animate-hero-float-3">
                <div className="w-full h-full border-2 border-black/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

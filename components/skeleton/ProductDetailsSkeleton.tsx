import ImageSliderSkeleton from "./ImageSliderSkeleton";
import QuantityProductSkeleton from "./QuantityProductSkeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-[1450px] px-4 sm:px-6 m-auto mt-6 sm:mt-12 animate-pulse">
      <div className="h-4 w-48 bg-gray-100 mb-8"></div>

      <div className="md:flex justify-between mb-10 sm:mb-16 gap-12">
        <div className="flex-1 md:flex-[0.8] justify-center items-center bg-white">
          <div className="flex w-full flex-col gap-4">
            <div className="mb-2 sm:mb-6">
              <ImageSliderSkeleton />
            </div>
          </div>
        </div>
        <div className="flex-1 pt-2 sm:pt-5">
          <div className="h-8 sm:h-10 bg-gray-200 w-3/4 mb-4 sm:mb-6"></div>
          <QuantityProductSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 sm:gap-16 mb-20">
        <div>
          <div className="flex border-b border-black/10 mb-6">
            <span className="pb-3 text-lg sm:text-xl font-black font-integral uppercase border-b-2 border-black tracking-widest opacity-20">
              Description
            </span>
          </div>
          <div className="h-32 bg-gray-100 w-full"></div>
        </div>
      </div>
    </div>
  );
}

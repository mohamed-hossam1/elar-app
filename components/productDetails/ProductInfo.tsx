"use client";

import ImageSlider from "./ImageSlider";
import QuantityProduct from "./QuantityProduct";
import * as motion from "motion/react-client";
import type { ProductDetails } from "@/types/Product";

export default function ProductInfo({
  product,
}: {
  product: ProductDetails;
}) {
  return (
    <motion.div
      className="md:flex justify-between mb-10 sm:mb-16 gap-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.15,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      <div className="flex-1 md:flex-[0.8] justify-center items-center bg-white">
        <div className="flex w-full flex-col gap-4">
          <div className="mb-2 sm:mb-6">
            <ImageSlider
              images={[
                ...(product.image_cover ? [product.image_cover] : []),
                ...(product.images?.map((img) => img.url) || []),
              ]}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 pt-2 sm:pt-5">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 font-integral uppercase tracking-tight leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1] as const,
          }}
        >
          {product.title}
        </motion.h1>
        <QuantityProduct product={product} />
      </div>
    </motion.div>
  );
}

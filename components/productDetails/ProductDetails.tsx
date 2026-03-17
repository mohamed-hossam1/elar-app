import RelatedProducts from "./RelatedProducts";
import ProductFAQ from "./ProductFAQ";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AnimatedSection from "@/components/home/AnimatedSection";
import ProductInfo from "./ProductInfo";
import type { ProductDetails as ProductDetailsType } from "@/types/Product";
import { Suspense } from "react";

export function ProductDetailsMain({
  product,
}: {
  product: ProductDetailsType | null;
}) {
  if (!product || product.is_deleted) {
    return (
      <div className="max-w-[1450px] px-5 m-auto mt-12 text-center py-20 font-satoshi">
        <h1 className="text-3xl font-bold mb-4 font-integral">
          Product Not Available
        </h1>
        <p className="text-black/50">
          The product you&apos;re looking for is currently unavailable or has
          been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1450px] px-4 sm:px-6 m-auto mt-6 sm:mt-12 font-satoshi pb-24 sm:pb-0">
      <AnimatedSection>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            { label: product.title },
          ]}
        />
      </AnimatedSection>

      <ProductInfo product={product} />

      <div className="grid grid-cols-1 gap-12 sm:gap-16 mb-20">
        {product.description && (
          <AnimatedSection>
            <div>
              <div className="flex border-b border-black/10 mb-6">
                <span className="pb-3 text-lg sm:text-xl font-black font-integral uppercase border-b-2 border-black tracking-widest">
                  Description
                </span>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg font-satoshi">
                {product.description}
              </p>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.1}>
          <ProductFAQ />
        </AnimatedSection>
      </div>
    </div>
  );
}

export function ProductDetailsRelated({
  product,
}: {
  product: ProductDetailsType | null;
}) {
  if (!product || product.is_deleted || !product.category_id) {
    return null;
  }

  return (
    <AnimatedSection>
      <div className="max-w-[1450px] px-4 sm:px-6 m-auto mb-20 font-satoshi">
        <div className="flex border-b border-black/10 mb-8 sm:mb-10">
          <h2 className="pb-4 text-xl sm:text-2xl md:text-3xl font-black font-integral uppercase border-b-2 border-black tracking-widest">
            You May Also Like
          </h2>
        </div>
        <Suspense fallback={null}>
          <RelatedProducts
            categoryId={product.category_id}
            productId={product.id}
          />
        </Suspense>
      </div>
    </AnimatedSection>
  );
}

export default function ProductDetails({
  product,
}: {
  product: ProductDetailsType | null;
}) {
  return (
    <>
      <ProductDetailsMain product={product} />
      <ProductDetailsRelated product={product} />
    </>
  );
}

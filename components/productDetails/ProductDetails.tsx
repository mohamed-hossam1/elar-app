import { getProductById } from "@/actions/productsAction";

import ImageSlider from "./ImageSlider";
import QuantityProduct from "./QuantityProduct";
import RelatedProducts from "./RelatedProducts";
import ProductFAQ from "./ProductFAQ";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export async function ProductDetailsMain({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  const product = response.success ? response.data : null;

  if (!product || product.is_deleted) {
    return (
      <div className="max-w-[1450px] px-5 m-auto mt-12 text-center py-20 font-satoshi">
        <h1 className="text-3xl font-bold mb-4 font-integral">Product Not Available</h1>
        <p className="text-black/50">
          The product you&apos;re looking for is currently unavailable or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1450px] px-4 sm:px-6 m-auto mt-6 sm:mt-12 font-satoshi pb-24 sm:pb-0">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.title },
        ]}
      />
      <div className="md:flex justify-between mb-10 sm:mb-16 gap-12">
          <div className="flex-1 md:flex-[0.8] justify-center items-center bg-white">
            <div className="flex w-full flex-col gap-4">
              <div className="mb-2 sm:mb-6">
                <ImageSlider
                  images={[
                    ...(product.image_cover ? [product.image_cover] : []),
                    ...(product.images?.map((img: any) => img.url) || []),
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 pt-2 sm:pt-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 font-integral uppercase tracking-tight leading-tight">
              {product.title}
            </h1>
            <QuantityProduct product={product} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:gap-16 mb-20">
          {product.description && (
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
          )}

          <ProductFAQ />
        </div>
      </div>
    );
}

export async function ProductDetailsRelated({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  const product = response.success ? response.data : null;

  if (!product || product.is_deleted || !product.category_id) {
    return null;
  }

  return (
    <div className="max-w-[1450px] px-4 sm:px-6 m-auto mb-20 font-satoshi">
      <div className="flex border-b border-black/10 mb-8 sm:mb-10">
        <h2 className="pb-4 text-xl sm:text-2xl md:text-3xl font-black font-integral uppercase border-b-2 border-black tracking-widest">
          You May Also Like
        </h2>
      </div>
      <RelatedProducts
        categoryId={product.category_id}
        productId={product.id}
      />
    </div>
  );
}

export default async function ProductDetails({ id }: { id: string }) {
  return (
    <>
      <ProductDetailsMain id={id} />
      <ProductDetailsRelated id={id} />
    </>
  );
}

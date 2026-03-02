import { Metadata } from "next";
import { Suspense } from "react";

import { getCanonicalUrl } from "@/lib/metadata/canonical";
import {
  getOgMetadata,
  getTwitterCardMetadata,
} from "@/lib/metadata/socialCards";

import ProductPageContent from "@/components/productDetails/ProductPageContent";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import { getProductById } from "@/lib/queries/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resp = await getProductById(Number(id));

  if (!resp.success) {
    return {
      title: "Product Not Found",
    };
  }
  const product = resp.data;

  const title = `${product.title} | ELAR`;
  const description =
    product.description?.slice(0, 160) ||
    `Shop ${product.title} at ELAR Egypt. Premium quality men's fashion with fast delivery.`;
  const image = product.image_cover || "";
  const path = `/products/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(path),
    },
    openGraph: getOgMetadata(title, description, path, image, "website"),
    twitter: getTwitterCardMetadata(title, description, image),
  };
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductPageContent />
    </Suspense>
  );
}

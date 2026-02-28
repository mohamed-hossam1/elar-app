import ProductDetails from "@/components/productDetails/ProductDetails";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import { Suspense } from "react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { getProductById } from "@/actions/productsAction";
import { CACHE_TAGS } from "@/constants/cacheTages";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import { getOgMetadata, getTwitterCardMetadata } from "@/lib/metadata/socialCards";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/metadata/structuredData";
import type { ProductDetails as ProductDetailsType } from "@/types/Product";

async function getCachedProductForPage(
  id: string,
): Promise<ProductDetailsType | null> {
  "use cache";
  const productId = Number(id);

  cacheLife("hours");

  if (!Number.isInteger(productId)) {
    return null;
  }

  cacheTag(CACHE_TAGS.products, CACHE_TAGS.product(productId));

  const response = await getProductById(productId);
  return response.success ? response.data : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getCachedProductForPage(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

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

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getCachedProductForPage(id);

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
  ];

  if (product) {
    breadcrumbItems.push({ name: product.title, item: `/products/${id}` });
  }

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const productSchema = product
    ? getProductSchema({
        name: product.title,
        description: product.description || "",
        image: product.image_cover || "",
        price: product.variants[0]?.price.toString() || "0",
        currency: "EGP",
        path: `/products/${id}`,
        sku: product.variants[0]?.sku || undefined,
      })
    : null;

  return (
    <>
    
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductDetails product={product} />
    </>
  );
}

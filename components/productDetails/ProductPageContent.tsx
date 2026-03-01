"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProductById } from "@/actions/productsAction";
import {
  getBreadcrumbSchema,
  getProductSchema,
} from "@/lib/metadata/structuredData";
import ProductDetails from "./ProductDetails";
import ProductDetailsSkeleton from "../skeleton/ProductDetailsSkeleton";

export default function ProductPageContent() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product-page", id],

    queryFn: async () => {
      const [productRes] = await Promise.all([getProductById(Number(id))]);

      return {
        productRes,
      };
    },
  });
  const product = data?.productRes?.success ? data.productRes.data : null;

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
  ];

  if (isLoading) return <ProductDetailsSkeleton />;

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

"use client";
import { getRelatedProducts } from "@/lib/queries/products";
import CardList from "../showProducts/CardList";
import { useQuery } from "@tanstack/react-query";

export default function RelatedProducts({
  categoryId,
  productId,
}: {
  categoryId: number;
  productId: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["related-products", categoryId, productId],

    queryFn: async () => {
      const productsRes = await getRelatedProducts(categoryId, productId);

      return {
        productsRes,
      };
    },
  });

  const products = data?.productsRes?.success ? data.productsRes.data : [];

  if (products.length === 0) return null;

  return (
    <div>
      <CardList products={products} />
    </div>
  );
}

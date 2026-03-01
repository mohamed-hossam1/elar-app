"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";

import ProductTable from "@/components/admin/products/ProductTable";

import { AdminProductFilters } from "@/types/Admin";

export default function ProductListContent() {
  const searchParams = useSearchParams();

  const filters: AdminProductFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,

      categoryId: searchParams.get("categoryId")
        ? Number(searchParams.get("categoryId"))
        : undefined,

      showDeleted: searchParams.get("showDeleted") === "true",

      isNewArrival: searchParams.get("isNewArrival") === "true",

      isTopSelling: searchParams.get("isTopSelling") === "true",
    }),
    [searchParams],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products-page", filters],

    queryFn: async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(filters),
        getAllCategories(),
      ]);

      return {
        productsRes,
        categoriesRes,
      };
    },

    staleTime: 0,
    gcTime: 0,
  });
  const products = data?.productsRes?.success ? data.productsRes.data : [];

  const categories = data?.categoriesRes?.success
    ? data.categoriesRes.data
    : [];

  return (
    <ProductTable
      products={products}
      categories={categories}
      isLoading={isLoading}
    />
  );
}

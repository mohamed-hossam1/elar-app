import { getProducts } from "@/lib/queries/products";
import { getAllCategories } from "@/lib/queries/categories";

import ProductTable from "@/components/admin/products/ProductTable";
import { AdminNotice } from "@/components/admin/AdminUI";
import { AdminProductFilters } from "@/types/Admin";

export default async function ProductListContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const filters = await searchParams;

  const adminFilters: AdminProductFilters = {
    search: filters.search || undefined,
    categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
    showDeleted: filters.showDeleted === "true",
    isNewArrival: filters.isNewArrival === "true",
    isTopSelling: filters.isTopSelling === "true",
  };

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(adminFilters),
    getAllCategories(),
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  if (!productsRes.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Products">
        {productsRes.message}
      </AdminNotice>
    );
  }

  return (
    <ProductTable
      products={products}
      categories={categories}
      isLoading={false}
    />
  );
}

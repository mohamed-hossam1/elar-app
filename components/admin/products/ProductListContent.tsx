import { getProducts } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";
import ProductTable from "@/components/admin/products/ProductTable";
import { AdminProductFilters } from "@/types/Admin";

export default async function ProductListContent({ filters }: { filters: AdminProductFilters }) {
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(filters),
    getAllCategories(),
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return <ProductTable products={products} categories={categories} />;
}

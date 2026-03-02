import { getAllCategories } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";
import CategoryTable from "@/components/admin/categories/CategoryTable";

export default async function CategoryListContent() {
  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  const productCounts: Record<number, number> = {};

    if (categories.length > 0) {
    const productsRes = await getProducts();
    const products = productsRes.success ? productsRes.data : [];

        products.forEach(p => {
      if (p.category_id) {
        productCounts[p.category_id] = (productCounts[p.category_id] || 0) + 1;
      }
    });
  }

  return <CategoryTable categories={categories} productCounts={productCounts} />;
}

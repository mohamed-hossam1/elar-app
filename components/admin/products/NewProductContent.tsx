import { getAllCategories } from "@/lib/queries/categories";
import ProductForm from "@/components/admin/products/ProductForm";

export default async function NewProductContent() {
  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return <ProductForm categories={categories} />;
}

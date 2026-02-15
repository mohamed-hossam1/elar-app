import { notFound } from "next/navigation";
import { getProductById } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";
import ProductForm from "@/components/admin/products/ProductForm";

export default async function EditProductContent({ id }: { id: number }) {
  const [productRes, categoriesRes] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);

  if (!productRes.success) {
    notFound();
  }

  const categories = categoriesRes.success ? categoriesRes.data : [];

  return <ProductForm product={productRes.data} categories={categories} />;
}

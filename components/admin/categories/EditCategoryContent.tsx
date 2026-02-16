import { notFound } from "next/navigation";
import { getCategoryById } from "@/actions/categoriesAction";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export default async function EditCategoryContent({ id }: { id: number }) {
  const res = await getCategoryById(id);

  if (!res.success) {
    notFound();
  }

  return <CategoryForm category={res.data} />;
}

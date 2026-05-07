import { getAllCategories } from "@/actions/categoriesAction";
import BrowseByStyle from "@/components/home/BrowseByStyle";
import { Category } from "@/types/Category";

export default async function CategoriesWrapper() {
  const categoriesRes = await getAllCategories();
  const categories: Category[] =
    categoriesRes.success && categoriesRes.data
      ? categoriesRes.data.filter(
          (category) =>
            Number.isFinite(category.id) &&
            Boolean(category.slug?.trim()) &&
            Boolean(category.title?.trim()),
        )
      : [];

  return <BrowseByStyle categories={categories} />;
}

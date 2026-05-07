import Link from "next/link";

import { getAllCategories } from "@/actions/categoriesAction";
import ROUTES from "@/constants/routes";

export default async function CategoryNavigation({
  activeCategorySlug,
}: {
  activeCategorySlug?: string;
}) {
  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  if (!categories.length) {
    return null;
  }

  return (
    <div className="max-w-[1600px] px-5 m-auto pt-8">
      <div className="flex flex-wrap gap-3 border-b border-black/10 pb-6">
        <Link
          href={ROUTES.PRODUCTS}
          className={`px-4 py-2 border uppercase tracking-wider text-xs font-bold transition-colors ${
            !activeCategorySlug
              ? "bg-black text-white border-black"
              : "bg-white text-black border-black hover:bg-black hover:text-white"
          }`}
        >
          All
        </Link>

        {categories.map((category) => {
          const isActive = activeCategorySlug === category.slug;

          return (
            <Link
              key={category.id}
              href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(category.slug)}`}
              className={`px-4 py-2 border uppercase tracking-wider text-xs font-bold transition-colors ${
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-black hover:text-white"
              }`}
            >
              {category.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

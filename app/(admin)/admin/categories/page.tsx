import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import CategoryListContent from "@/components/admin/categories/CategoryListContent";
import AdminCategoryListSkeleton from "@/components/skeleton/AdminCategoryListSkeleton";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organize your products into logical groupings for easier browsing."
        actions={
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        }
      />

      <Suspense fallback={<AdminCategoryListSkeleton />}>
        <CategoryListContent />
      </Suspense>
    </div>
  );
}

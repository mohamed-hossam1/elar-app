import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import EditCategoryContent from "@/components/admin/categories/EditCategoryContent";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Category"
        description="Modify category details."
      />

      <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading category...</div>}>
        <EditCategoryContent id={categoryId} />
      </Suspense>
    </div>
  );
}

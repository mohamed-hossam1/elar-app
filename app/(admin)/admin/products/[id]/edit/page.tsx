import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import EditProductContent from "@/components/admin/products/EditProductContent";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Product"
        description="Modify product details."
      />

      <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading product...</div>}>
        <EditProductContent id={productId} />
      </Suspense>
    </div>
  );
}

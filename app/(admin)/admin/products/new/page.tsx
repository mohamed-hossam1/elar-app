import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import NewProductContent from "@/components/admin/products/NewProductContent";

export default async function NewProductPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Product"
        description="Create a new product with multiple variants and gallery images."
      />

      <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading form...</div>}>
        <NewProductContent />
      </Suspense>
    </div>
  );
}

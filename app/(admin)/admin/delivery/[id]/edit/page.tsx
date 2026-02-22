import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import EditDeliveryContent from "@/components/admin/delivery/EditDeliveryContent";

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Delivery Setting"
        description="Modify delivery fee for city."
        backHref="/admin/delivery"
      />

      <div className="rounded-xl border border-neutral-100 bg-white p-6 md:p-8">
        <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading delivery setting...</div>}>
          <EditDeliveryContent id={numericId} />
        </Suspense>
      </div>
    </div>
  );
}

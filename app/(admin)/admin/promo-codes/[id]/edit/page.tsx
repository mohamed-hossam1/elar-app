import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import EditPromoCodeContent from "@/components/admin/promo-codes/EditPromoCodeContent";

export default async function EditPromoCodePage({
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
        title="Edit Promo Code"
        description="Modify promo code details."
        backHref="/admin/promo-codes"
      />

      <div className="rounded-xl border border-neutral-100 bg-white p-6 md:p-8">
        <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading promo code...</div>}>
          <EditPromoCodeContent id={numericId} />
        </Suspense>
      </div>
    </div>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { AdminPromoFilters, PromoStatusFilter } from "@/types/Admin";
import PromoCodeListContent from "@/components/admin/promo-codes/PromoCodeListContent";
import AdminPromoCodeListSkeleton from "@/components/skeleton/AdminPromoCodeListSkeleton";

export default function AdminPromoCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promo Codes"
        description="Manage your promotional coupons and discount rules."
        actions={
          <Link
            href="/admin/promo-codes/new"
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            <Plus className="h-4 w-4" />
            Add Promo Code
          </Link>
        }
      />

      <Suspense fallback={<AdminPromoCodeListSkeleton />}>
        <PromoCodeListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PromoCodeListWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: AdminPromoFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    status: (typeof params.status === "string" ? params.status : "all") as PromoStatusFilter,
  };

  return <PromoCodeListContent filters={filters} />;
}

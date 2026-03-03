import { getPromoCodes } from "@/lib/queries/promoCodes";
import { AdminNotice } from "@/components/admin/AdminUI";
import { PromoCodeTable } from "@/components/admin/promo-codes/PromoCodeTable";
import { AdminPromoFilters, PromoStatusFilter } from "@/types/Admin";

export default async function PromoCodeListContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const filters = await searchParams;

  const adminFilters: AdminPromoFilters = {
    search: filters.search || undefined,
    status: (filters.status || "all") as PromoStatusFilter,
  };

  const result = await getPromoCodes(adminFilters);

  if (!result.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Promo Codes">
        {result.message}
      </AdminNotice>
    );
  }

  return (
    <PromoCodeTable
      promoCodes={result.success ? result.data : []}
      isLoading={false}
    />
  );
}

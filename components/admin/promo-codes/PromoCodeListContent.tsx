import { getPromoCodes } from "@/actions/promoCodeAction";
import { PromoCodeTable } from "@/components/admin/promo-codes/PromoCodeTable";
import { AdminPromoFilters } from "@/types/Admin";

export default async function PromoCodeListContent({ filters }: { filters: AdminPromoFilters }) {
  const res = await getPromoCodes(filters);
  const promoCodes = res.success ? res.data : [];

  return <PromoCodeTable initialData={promoCodes} />;
}

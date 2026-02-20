import { notFound } from "next/navigation";
import { getPromoCodeById } from "@/actions/promoCodeAction";
import { PromoCodeForm } from "@/components/admin/promo-codes/PromoCodeForm";

export default async function EditPromoCodeContent({ id }: { id: number }) {
  const res = await getPromoCodeById(id);

  if (!res.success) {
    notFound();
  }

  return <PromoCodeForm initialData={res.data} />;
}

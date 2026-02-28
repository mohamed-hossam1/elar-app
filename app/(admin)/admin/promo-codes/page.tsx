import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import PromoCodeListContent from "@/components/admin/promo-codes/PromoCodeListContent";

export default function AdminPromoCodesPage() {
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
      <PromoCodeListContent />
    </div>
  );
}

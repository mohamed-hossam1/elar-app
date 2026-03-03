import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import ProductListContent from "@/components/admin/products/ProductListContent";
import AdminProductListSkeleton from "@/components/skeleton/AdminProductListSkeleton";
import SuspenseWithSearchParams from "@/components/SuspenseWithSearchParams";

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage your product catalog, variants, and merchandising ranks."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        }
      />
      <SuspenseWithSearchParams fallback={<AdminProductListSkeleton />}>
        <ProductListContent searchParams={searchParams} />
      </SuspenseWithSearchParams>
    </div>
  );
}

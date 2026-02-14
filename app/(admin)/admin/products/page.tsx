import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { AdminProductFilters } from "@/types/Admin";
import ProductListContent from "@/components/admin/products/ProductListContent";
import AdminProductListSkeleton from "@/components/skeleton/AdminProductListSkeleton";

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

      <Suspense fallback={<AdminProductListSkeleton />}>
        <ProductListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProductListWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const filters: AdminProductFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    categoryId: typeof params.categoryId === "string" ? parseInt(params.categoryId) : undefined,
    showDeleted: params.showDeleted === "true",
    isNewArrival: params.isNewArrival === "true",
    isTopSelling: params.isTopSelling === "true",
  };

  return <ProductListContent filters={filters} />;
}

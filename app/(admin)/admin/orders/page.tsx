import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { AdminOrderFilters } from "@/types/Admin";
import OrderListContent from "@/components/admin/orders/OrderListContent";
import AdminOrderListSkeleton from "@/components/skeleton/AdminOrderListSkeleton";

export const metadata = {
  title: "Admin - Orders",
};

export default function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Orders" 
        description="Manage all customer and guest orders, review fulfillment details, and update order statuses."
      />
      <Suspense fallback={<AdminOrderListSkeleton />}>
        <OrderListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrderListWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const filters: AdminOrderFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    paymentMethod: typeof params.paymentMethod === "string" ? params.paymentMethod : undefined,
    customerType: params.customerType === "guest" || params.customerType === "user"
      ? params.customerType : undefined,
    dateFrom: typeof params.dateFrom === "string" ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === "string" ? params.dateTo : undefined,
  };

  return <OrderListContent filters={filters} />;
}

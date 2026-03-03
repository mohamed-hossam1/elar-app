import { AdminPageHeader } from "@/components/admin/AdminUI";
import OrderListContent from "@/components/admin/orders/OrderListContent";
import AdminOrderListSkeleton from "@/components/skeleton/AdminOrderListSkeleton";
import SuspenseWithSearchParams from "@/components/SuspenseWithSearchParams";

export const metadata = {
  title: "Admin - Orders",
};

export default function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="Manage all customer and guest orders, review fulfillment details, and update order statuses."
      />
      <SuspenseWithSearchParams fallback={<AdminOrderListSkeleton />}>
        <OrderListContent searchParams={searchParams} />
      </SuspenseWithSearchParams>
    </div>
  );
}

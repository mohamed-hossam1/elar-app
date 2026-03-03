import { getAdminOrders } from "@/lib/queries/orders";
import { AdminNotice } from "@/components/admin/AdminUI";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { AdminOrderFilters } from "@/types/Admin";

export default async function OrderListContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const filters = await searchParams;

  const adminFilters: AdminOrderFilters = {
    search: filters.search || undefined,
    status: filters.status || undefined,
    paymentMethod: filters.paymentMethod || undefined,
    customerType:
      filters.customerType === "guest" || filters.customerType === "user"
        ? filters.customerType
        : undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  };

  const result = await getAdminOrders(adminFilters);

  if (!result.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Orders">
        {result.message}
      </AdminNotice>
    );
  }

  return <OrderTable orders={result.success ? result.data : []} isLoading={false} />;
}

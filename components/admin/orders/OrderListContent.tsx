import { getAdminOrders } from "@/actions/ordersAction";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { AdminOrderFilters } from "@/types/Admin";

export default async function OrderListContent({ filters }: { filters: AdminOrderFilters }) {
  const response = await getAdminOrders(filters);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch orders");
  }

  const orders = response.data;

  return <OrderTable orders={orders || []} filters={filters} />;
}

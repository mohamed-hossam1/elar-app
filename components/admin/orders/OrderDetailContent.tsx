import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/actions/ordersAction";
import { OrderDetail } from "@/components/admin/orders/OrderDetail";

export default async function OrderDetailContent({ id }: { id: number }) {
  const response = await getAdminOrderById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const order = response.data;

  return <OrderDetail order={order} />;
}

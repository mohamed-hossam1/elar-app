import { AdminPageHeader } from "@/components/admin/AdminUI";
import OrderListContent from "@/components/admin/orders/OrderListContent";

export const metadata = {
  title: "Admin - Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Orders" 
        description="Manage all customer and guest orders, review fulfillment details, and update order statuses."
      />
      <OrderListContent />
    </div>
  );
}

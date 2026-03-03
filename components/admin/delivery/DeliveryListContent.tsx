import { getDeliverySettings } from "@/lib/queries/delivery";
import { AdminNotice } from "@/components/admin/AdminUI";
import { DeliveryTable } from "@/components/admin/delivery/DeliveryTable";

export default async function DeliveryListContent() {
  const result = await getDeliverySettings();

  if (!result.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Delivery Settings">
        {result.message}
      </AdminNotice>
    );
  }

  return (
    <DeliveryTable
      deliverySettings={result.success ? result.data : []}
      isLoading={false}
    />
  );
}

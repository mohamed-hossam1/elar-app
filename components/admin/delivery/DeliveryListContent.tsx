import { getDeliverySettings } from "@/actions/deliveryAction";
import { DeliveryTable } from "@/components/admin/delivery/DeliveryTable";

export default async function DeliveryListContent() {
  const res = await getDeliverySettings();
  const settings = res.success ? res.data : [];

  return <DeliveryTable initialData={settings} />;
}

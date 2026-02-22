import { notFound } from "next/navigation";
import { getDeliverySettingById } from "@/actions/deliveryAction";
import { DeliveryForm } from "@/components/admin/delivery/DeliveryForm";

export default async function EditDeliveryContent({ id }: { id: number }) {
  const res = await getDeliverySettingById(id);

  if (!res.success) {
    notFound();
  }

  return <DeliveryForm initialData={res.data} />;
}

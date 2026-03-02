"use client";

import { useQuery } from "@tanstack/react-query";
import { getDeliverySettings } from "@/lib/queries/delivery";
import { AdminNotice } from "@/components/admin/AdminUI";
import { DeliveryTable } from "@/components/admin/delivery/DeliveryTable";

export default function DeliveryListContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-delivery-page"],
    queryFn: () => getDeliverySettings(),
    staleTime: 1000 * 60 * 5,
  });

  if (data && !data.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Delivery Settings">
        {data.message}
      </AdminNotice>
    );
  }

  return (
    <DeliveryTable
      deliverySettings={data?.success ? data.data : []}
      isLoading={isLoading}
    />
  );
}

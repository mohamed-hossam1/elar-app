"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAdminOrders } from "@/lib/queries/orders";
import { AdminNotice } from "@/components/admin/AdminUI";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { AdminOrderFilters } from "@/types/Admin";

export default function OrderListContent() {
  const searchParams = useSearchParams();

  const filters: AdminOrderFilters = useMemo(
    () => {
      const customerTypeParam = searchParams.get("customerType");

      return {
        search: searchParams.get("search") || undefined,
        status: searchParams.get("status") || undefined,
        paymentMethod: searchParams.get("paymentMethod") || undefined,
        customerType:
          customerTypeParam === "guest" || customerTypeParam === "user"
            ? customerTypeParam
            : undefined,
        dateFrom: searchParams.get("dateFrom") || undefined,
        dateTo: searchParams.get("dateTo") || undefined,
      };
    },
    [searchParams],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders-page", filters],
    queryFn: () => getAdminOrders(filters),
    staleTime: 1000 * 60 * 5,
  });

  if (data && !data.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Orders">
        {data.message}
      </AdminNotice>
    );
  }

  return <OrderTable orders={data?.success ? data.data : []} isLoading={isLoading} />;
}

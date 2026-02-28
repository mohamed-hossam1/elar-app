"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAdminOrders } from "@/actions/ordersAction";
import { AdminNotice } from "@/components/admin/AdminUI";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { AdminOrderFilters } from "@/types/Admin";

export default function OrderListContent() {
  const searchParams = useSearchParams();

  const filters: AdminOrderFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      paymentMethod: searchParams.get("paymentMethod") || undefined,
      customerType:
        searchParams.get("customerType") === "guest" ||
        searchParams.get("customerType") === "user"
          ? searchParams.get("customerType")
          : undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
    }),
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

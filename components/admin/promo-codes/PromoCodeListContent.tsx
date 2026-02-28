"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getPromoCodes } from "@/actions/promoCodeAction";
import { AdminNotice } from "@/components/admin/AdminUI";
import { PromoCodeTable } from "@/components/admin/promo-codes/PromoCodeTable";
import { AdminPromoFilters, PromoStatusFilter } from "@/types/Admin";

export default function PromoCodeListContent() {
  const searchParams = useSearchParams();

  const filters: AdminPromoFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      status: (searchParams.get("status") || "all") as PromoStatusFilter,
    }),
    [searchParams],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-promo-codes-page", filters],
    queryFn: () => getPromoCodes(filters),
    staleTime: 1000 * 60 * 5,
  });

  if (data && !data.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Promo Codes">
        {data.message}
      </AdminNotice>
    );
  }

  return (
    <PromoCodeTable
      promoCodes={data?.success ? data.data : []}
      isLoading={isLoading}
    />
  );
}

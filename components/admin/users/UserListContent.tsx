"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAdminUsers } from "@/actions/userAction";
import { AdminNotice } from "@/components/admin/AdminUI";
import UserTable from "@/components/admin/users/UserTable";
import { AdminUserFilters, AdminRole } from "@/types/Admin";

export default function UserListContent() {
  const searchParams = useSearchParams();

  const filters: AdminUserFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      role: searchParams.get("role") as AdminRole | undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
    }),
    [searchParams],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users-page", filters],
    queryFn: () => getAdminUsers(filters),
    staleTime: 1000 * 60 * 5,
  });

  if (data && !data.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Users">
        {data.message}
      </AdminNotice>
    );
  }

  return <UserTable users={data?.success ? data.data : []} isLoading={isLoading} />;
}

import { getAdminUsers } from "@/lib/queries/users";
import { AdminNotice } from "@/components/admin/AdminUI";
import UserTable from "@/components/admin/users/UserTable";
import { AdminUserFilters, AdminRole } from "@/types/Admin";

export default async function UserListContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const filters = await searchParams;

  const adminFilters: AdminUserFilters = {
    search: filters.search || undefined,
    role: filters.role as AdminRole | undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  };

  const result = await getAdminUsers(adminFilters);

  if (!result.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Users">
        {result.message}
      </AdminNotice>
    );
  }

  return <UserTable users={result.success ? result.data : []} isLoading={false} />;
}

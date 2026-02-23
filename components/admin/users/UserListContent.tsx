import { getAdminUsers } from "@/actions/userAction";
import UserTable from "@/components/admin/users/UserTable";
import { AdminNotice } from "@/components/admin/AdminUI";
import { AdminRole } from "@/types/Admin";

interface UserListContentProps {
  filters: {
    search?: string;
    role?: AdminRole;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function UserListContent({ filters }: UserListContentProps) {
  const result = await getAdminUsers(filters);

  if (!result.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Users">
        {result.message}
      </AdminNotice>
    );
  }

  return <UserTable users={result.data} />;
}

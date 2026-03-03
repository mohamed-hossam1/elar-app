import { AdminPageHeader } from "@/components/admin/AdminUI";
import UserListContent from "@/components/admin/users/UserListContent";
import AdminUserListSkeleton from "@/components/skeleton/AdminUserListSkeleton";
import SuspenseWithSearchParams from "@/components/SuspenseWithSearchParams";

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Administration"
        description="Manage user accounts, roles, and platform access."
      />
      <SuspenseWithSearchParams fallback={<AdminUserListSkeleton />}>
        <UserListContent searchParams={searchParams} />
      </SuspenseWithSearchParams>
    </div>
  );
}

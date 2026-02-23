import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { AdminRole } from "@/types/Admin";
import UserListContent from "@/components/admin/users/UserListContent";
import AdminUserListSkeleton from "@/components/skeleton/AdminUserListSkeleton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default function AdminUsersPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="User Administration" 
        description="Manage user accounts, roles, and platform access."
      />
      
      <Suspense fallback={<AdminUserListSkeleton />}>
        <UserListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function UserListWrapper({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    role?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const params = await searchParams;
  
  const filters = {
    search: params.search,
    role: params.role as AdminRole,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };

  return <UserListContent filters={filters} />;
}

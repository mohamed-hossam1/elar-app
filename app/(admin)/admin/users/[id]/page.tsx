import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import ROUTES from "@/constants/routes";
import UserDetailContent from "@/components/admin/users/UserDetailContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="User Detail" 
        description="Managing account details and order history."
        backHref={ROUTES.ADMIN_USERS}
      />
      
      <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading user profile...</div>}>
        <UserDetailContent id={id} />
      </Suspense>
    </div>
  );
}

import { getCurrentUserProfile, isAdminRole } from "@/lib/auth/admin";
import AdminChrome from "@/components/admin/AdminChrome";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";
import AdminLayoutSkeleton from "@/components/skeleton/AdminLayoutSkeleton";

import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserProfile();

  if (!user || !isAdminRole(user.role)) {
    return <AdminAccessDenied userName={user?.name} />;
  }

  return <AdminChrome currentUser={user}>{children}</AdminChrome>;
}

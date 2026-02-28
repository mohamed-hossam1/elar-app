import { AdminPageHeader } from "@/components/admin/AdminUI";
import UserListContent from "@/components/admin/users/UserListContent";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="User Administration" 
        description="Manage user accounts, roles, and platform access."
      />
      <UserListContent />
    </div>
  );
}

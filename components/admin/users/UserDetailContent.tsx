import { notFound } from "next/navigation";
import { AdminNotice } from "@/components/admin/AdminUI";
import { getAdminUserById, GetUser } from "@/actions/userAction";
import { getAdminOrders } from "@/actions/ordersAction";
import UserProfileCard from "@/components/admin/users/UserProfileCard";
import UserOrdersTable from "@/components/admin/users/UserOrdersTable";

export default async function UserDetailContent({ id }: { id: string }) {
  
  const [userResult, ordersResult, currentUserResult] = await Promise.all([
    getAdminUserById(id),
    getAdminOrders({ userId: id }),
    GetUser(),
  ]);

  if (!userResult.success) {
    if (userResult.message === "User not found") {
      notFound();
    }
    return (
      <AdminNotice tone="danger" title="Error Loading User">
        {userResult.message}
      </AdminNotice>
    );
  }

  const user = userResult.data;
  const orders = ordersResult.success ? ordersResult.data : [];
  const isSelf = currentUserResult.success && currentUserResult.data.id === id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-1">
        <UserProfileCard user={user} isSelf={isSelf} />
      </div>
      <div className="lg:col-span-2">
        <UserOrdersTable orders={orders} />
      </div>
    </div>
  );
}

import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import ROUTES from "@/constants/routes";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderDetailContent from "@/components/admin/orders/OrderDetailContent";

export const metadata = {
  title: "Admin - Order Detail",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title={`Order #${orderId}`}
        description={`View details, items, and payment for Order #${orderId}.`}
        actions={
          <Link 
            href={ROUTES.ADMIN_ORDERS} 
            className="inline-flex border border-black bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black/5"
          >
            Back to Orders
          </Link>
        }
      />
      <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading order details...</div>}>
        <OrderDetailContent id={orderId} />
      </Suspense>
    </div>
  );
}

import Orders from "@/components/orders/Orders";
import OrdersList from "@/components/orders/OrdersList";
import { Suspense } from "react";
import OrdersSkeleton from "@/components/skeleton/OrdersSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders | ELAR",
  description: "View and track your previous orders at ELAR.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  return (
    <Orders>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersList />
      </Suspense>
    </Orders>
  );
}

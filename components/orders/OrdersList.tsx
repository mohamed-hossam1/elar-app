import { getUserOrders } from "@/actions/ordersAction";
import OrderCard from "./OrderCard";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { ShoppingBag } from "lucide-react";
import AnimatedSection from "@/components/home/AnimatedSection";

export default async function OrdersList() {
  const orders = (await getUserOrders()) || [];

  if (orders.length === 0) {
    return (
      <AnimatedSection>
        <div className="border border-black p-12 sm:p-20 text-center bg-white">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <p className="text-black text-xl sm:text-2xl font-black mb-2 sm:mb-3 uppercase font-integral tracking-widest">
            No orders yet
          </p>
          <p className="text-black/60 mb-8 sm:mb-10 max-w-xs mx-auto font-satoshi uppercase tracking-wider text-[10px] sm:text-xs leading-relaxed">
            You haven&apos;t placed any orders with ELAR yet. Start your journey with us today.
          </p>
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-block bg-black text-white px-8 sm:px-12 py-4 sm:py-5 font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black border border-black transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <>
      {orders.map((order, index) => (
        <div
          key={order.id}
          style={{
            animation: `fade-in-up 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <OrderCard order={order} />
        </div>
      ))}
    </>
  );
}

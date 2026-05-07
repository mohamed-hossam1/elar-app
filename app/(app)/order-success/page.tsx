import Image from "@/components/imageKit/ImageOptimization";
import { OrderItem } from "@/types/Order";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import ROUTES from "@/constants/routes";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { egpFormatter } from "@/lib/format/currency";

export const metadata: Metadata = {
  title: "Order Success | ELAR",
  description:
    "Your order has been placed successfully. Thank you for shopping with ELAR.",
  robots: {
    index: false,
    follow: false,
  },
};

import { getOrderById, getCurrentOrderScope } from "@/actions/ordersAction";
import OrderSuccessSkeleton from "@/components/skeleton/OrderSuccessSkeleton";
import { Suspense } from "react";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <Suspense fallback={<OrderSuccessSkeleton />}>
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

async function OrderSuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect(ROUTES.HOME);
  }

  const { userId, guestId } = await getCurrentOrderScope();
  const orderRes = await getOrderById(Number(orderId), userId, guestId);

  if (!orderRes.success) {
    redirect(ROUTES.HOME);
  }

  const order = orderRes.data;


  let phone = order.phone || "N/A";
  if (!order.phone && order.user_id) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: userData } = await supabase
      .from("users")
      .select("phone")
      .eq("id", order.user_id)
      .single();
    if (userData?.phone) {
      phone = userData.phone;
    }
  }

  const addressInfo = {
    name: order.user_name || "N/A",
    phone: phone,
    address_line: order.address_line || "N/A",
    city: order.city || "N/A",
    area: order.area || "",
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-16 font-satoshi">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-white border border-black p-4 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border border-black bg-black flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-integral font-black tracking-wider uppercase text-black leading-tight">
                Order placed successfully
              </h1>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/60 mt-1">
                Order ID: <span className="text-black">#{order.id}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:ml-auto">
            <span className="inline-flex items-center px-4 py-1.5 sm:px-6 sm:py-2 border border-black text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-black whitespace-nowrap bg-white">
              {order.status}
            </span>
          </div>
        </div>

        <div className="bg-white border border-black p-4 sm:p-8">
          <h2 className="font-integral font-black text-base sm:text-lg text-black mb-4 sm:mb-6 uppercase tracking-wider border-b border-black pb-4">
            Order items
          </h2>

          <div className="space-y-6">
            {order.items?.map((item: OrderItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-black/10 last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 border border-black overflow-hidden  shrink-0">
                    <Image
                      fill
                      src={item.product_image}
                      alt={item.product_title}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-black uppercase tracking-wide text-xs sm:text-base leading-tight line-clamp-2">
                      {item.product_title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 border border-black"
                        style={{ backgroundColor: item.variant_color }}
                      />
                      <span className="text-black/20 font-light text-sm">|</span>
                      <span className="text-[9px] sm:text-[10px] font-black text-black/60 uppercase tracking-[0.2em]">{item.variant_size}</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black text-black/60 mt-1 sm:mt-1.5 uppercase tracking-widest">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end sm:block shrink-0 sm:ml-4">
                  <div className="border border-black px-3 py-1.5 sm:px-4 sm:py-2 bg-white min-w-[90px] sm:min-w-[120px] text-center">
                    <p className="font-black text-black text-[10px] whitespace-nowrap">
                      {egpFormatter.format(item.price_at_purchase * item.quantity)}
                    </p>
                    <p className="text-[9px] font-black text-black/60 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                      {egpFormatter.format(item.price_at_purchase)} each
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white border border-black p-4 sm:p-8">
            <h2 className="font-integral font-black text-base sm:text-lg text-black mb-4 sm:mb-6 uppercase tracking-wider border-b border-black pb-4">
              Order summary
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black">
                <span className="text-black/60">Subtotal</span>
                <span className="text-black">{egpFormatter.format(order.subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black">
                <span className="text-black/60">Delivery</span>
                <span className="text-black">
                  {order.delivery_fee > 0
                    ? egpFormatter.format(order.delivery_fee)
                    : "FREE"}
                </span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between items-center text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black">
                  <span className="text-black/60">Discount</span>
                  <span className="bg-black text-white px-2 py-0.5 sm:px-3 sm:py-1">
                    -{egpFormatter.format(order.discount_amount)}
                  </span>
                </div>
              )}

              <div className="border-t border-black pt-5 sm:pt-6 flex justify-between items-center">
                <span className="font-integral font-black text-base sm:text-lg uppercase tracking-wider">Total</span>
                <span className="font-integral font-black text-xl sm:text-2xl">{egpFormatter.format(order.total_price)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black p-4 sm:p-8">
            <h2 className="font-integral font-black text-base sm:text-lg text-black mb-4 sm:mb-6 uppercase tracking-wider border-b border-black pb-4">
              Shipping address
            </h2>

            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/60">Recipient</p>
                <p className="font-black text-black uppercase tracking-wide text-sm sm:text-base">{addressInfo.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/60">Phone</p>
                <p className="font-black text-black text-sm sm:text-base">{addressInfo.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-black/60">Delivery Location</p>
                <p className="font-black text-black uppercase tracking-wide text-sm sm:text-base leading-relaxed">
                  {addressInfo.address_line}
                  <br />
                  {addressInfo.area}, {addressInfo.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 pb-10 sm:pb-0">
          {order.user_id && (
            <Link
              href={ROUTES.ORDERS}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 sm:py-5 font-black text-white bg-black border border-black hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] text-[10px] sm:text-xs"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              View orders
            </Link>
          )}

          <Link
            href={ROUTES.HOME}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 sm:py-5 font-black bg-white text-black border border-black hover:bg-black hover:text-white transition-all uppercase tracking-[0.2em] text-[10px] sm:text-xs"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

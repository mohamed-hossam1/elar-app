"use client";

import { validatePromoCode } from "@/lib/queries/promoCodes";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/stores/cartStore";
import { egpFormatter } from "@/lib/format/currency";
import { Tag, ArrowRight, Loader2 } from "lucide-react";

const couponFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

interface OrderSummaryProps {
  price: number;
  isCart: boolean;
  deliveryFee: number;
  hasAddress?: boolean;
  isLoadingFee?: boolean;
}

export default function OrderSummary({
  price,
  isCart,
  deliveryFee,
  hasAddress = false,
  isLoadingFee = false,
}: OrderSummaryProps) {
  const { appliedPromo, setAppliedPromo } = useCart();
  const [promoCode, setPromoCode] = useState<string>(appliedPromo?.code || "");
  const [promoError, setPromoError] = useState<string>("");
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const isConditionMet = appliedPromo
    ? price >= appliedPromo.min_purchase
    : true;

  const discountAmount =
    appliedPromo && isConditionMet
      ? appliedPromo.type === "percentage"
        ? (price * appliedPromo.value) / 100
        : Math.min(price, appliedPromo.value)
      : 0;

  const finalPrice = Math.max(0, price - discountAmount);
  const totalWithDelivery = finalPrice + (hasAddress ? deliveryFee : 0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplying(true);
    setPromoError("");

    try {
      const result = await validatePromoCode(promoCode.trim(), price);

      if (!result || !result.success) {
        setPromoError(result?.message || "Invalid promo code");
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo(result.data?.coupon || null);
      setPromoError("");
    } catch (err) {
      setPromoError("Error applying promo code. Please try again.");
      setAppliedPromo(null);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  return (
    <div className="w-full lg:flex-2 font-satoshi">
      <div className="bg-white border border-black p-6 sm:p-8 lg:sticky lg:top-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-integral uppercase">
          Order Summary
        </h3>

        {isCart && (
          <div className="mb-8">
            <div className="relative group">
              <div className="flex flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Tag className="w-5 h-5 text-black/20" />
                  </div>
                  <input
                    placeholder="Add promo code"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-black rounded-none focus:ring-1 focus:ring-black transition-all text-sm md:text-base outline-none disabled:opacity-50"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isApplying || !!appliedPromo}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                  />
                </div>
                {appliedPromo ? (
                  <button
                    className="px-6 py-3 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-widest text-xs md:text-sm cursor-pointer"
                    onClick={handleRemovePromo}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    disabled={!promoCode.trim() || isApplying}
                    className="px-8 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest text-xs md:text-sm cursor-pointer"
                    onClick={handleApplyPromo}
                  >
                    {isApplying ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                )}
              </div>

              {promoError && (
                <p className="text-red-500 text-xs md:text-sm mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider border border-red-500/20 p-2 bg-red-50 animate-in fade-in slide-in-from-top-1">
                  {promoError}
                </p>
              )}
              {appliedPromo && isConditionMet && (
                <p className="text-green-600 text-xs md:text-sm mt-3 flex items-center gap-1.5 font-black uppercase tracking-wider border border-green-500/20 p-2 bg-green-50 animate-in fade-in slide-in-from-top-1">
                  {appliedPromo.type === "percentage"
                    ? `${Math.round(appliedPromo.value)}%`
                    : couponFormatter.format(appliedPromo.value)}{" "}
                  discount applied
                </p>
              )}
              {appliedPromo && !isConditionMet && (
                <p className="text-red-500 text-xs md:text-sm mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider border border-red-500/20 p-2 bg-red-50 animate-in fade-in slide-in-from-top-1">
                  {`Minimum purchase of ${couponFormatter.format(appliedPromo.min_purchase)} required.`}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-black/60">
            <span className="text-base md:text-lg">Subtotal</span>
            <span className="font-bold text-black text-base md:text-lg">
              {egpFormatter.format(price)}
            </span>
          </div>

          {appliedPromo && isConditionMet && (
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg text-black/60">
                Discount (
                {appliedPromo.type === "percentage"
                  ? `${appliedPromo.value}%`
                  : "Fixed"}
                )
              </span>
              <span className="font-bold text-red-500 text-base md:text-lg">
                -{egpFormatter.format(discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-base md:text-lg text-black/60">
              Delivery Fee
            </span>
            <span className="font-bold text-black text-base md:text-lg">
              {isLoadingFee ? (
                <div className="h-6 w-20 bg-gray-50 animate-pulse rounded-none"></div>
              ) : isCart ? (
                <span className="text-black/60 font-medium">
                  Calculated later
                </span>
              ) : !hasAddress ? (
                <span className="text-black/60 font-medium">Add address</span>
              ) : (
                egpFormatter.format(deliveryFee)
              )}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg md:text-xl font-bold text-gray-900 font-integral">
                Total
              </span>
              <span className="text-2xl md:text-3xl font-black text-black font-integral">
                {isLoadingFee ? (
                  <div className="h-8 w-24 bg-gray-50 animate-pulse"></div>
                ) : (
                  egpFormatter.format(totalWithDelivery)
                )}
              </span>
            </div>
          </div>
        </div>

        {isCart && (
          <div className="space-y-4">
            {price > 0 && (
              <Link
                className="flex items-center justify-center w-full bg-black text-white py-4 md:py-5 px-6 font-bold border border-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
                href={ROUTES.CHECKOUT}
              >
                Go to Checkout
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              className="flex items-center justify-center w-full bg-white text-black py-4 md:py-5 px-6 font-bold border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
              href={ROUTES.HOME}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

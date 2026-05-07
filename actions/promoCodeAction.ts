import { CACHE_TAGS } from "@/constants/cacheTages";
import { createAdminClient } from "@/lib/supabase/admin";
import { PromoCode } from "@/types/PromoCode";
import { cacheLife, cacheTag } from "next/cache";


export const validatePromoCode = async function validatePromoCode(promoCode: string, price: number): Promise<{
    success: true;
    message: string;
    data: {
      originalPrice: number;
      finalPrice: number;
      discountApplied: number;
      coupon: PromoCode;
      isConditionMet: boolean;
    }
  } | {
    success: false;
    message: string;
  }> {
  "use cache";
  cacheTag(CACHE_TAGS.promoCodes);
  cacheLife("hours");
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", promoCode)
      .limit(1)
      .maybeSingle();

    if (error) {
      return { success: false, message: "Database error." };
    }

    const coupon = data as PromoCode | null;

    if (!coupon) {
      return { success: false, message: "Promo code not found." };
    }

    if (!coupon.is_active) {
      return { success: false, message: "Promo code is not active." };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
       return { success: false, message: "Promo code has expired." };
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return { success: false, message: "Promo code usage limit reached." };
    }

    const isConditionMet = price >= coupon.min_purchase;

        let discountAmount = 0;
    if (isConditionMet) {
      if (coupon.type === "percentage") {
        const pct = Math.max(0, Math.min(100, coupon.value));
        discountAmount = (price * pct) / 100;
      } else {
        discountAmount = Math.min(price, coupon.value);
      }
    }

    const finalPrice = Math.round((price - discountAmount) * 100) / 100;

    return {
      success: true,
      message: isConditionMet ? "Promo code applied." : `Minimum purchase of EGP ${coupon.min_purchase} required.`,
      data: {
        originalPrice: price,
        finalPrice,
        discountApplied: discountAmount,
        isConditionMet,
        coupon: {
          ...coupon,
          discount_percentage: coupon.type === "percentage" ? coupon.value : undefined,
        } as PromoCode,
      }
    };
  } catch (error: any) {
    console.error("validatePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
};

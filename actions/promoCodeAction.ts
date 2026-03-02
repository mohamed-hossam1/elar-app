"use server";
import { verifyAdmin } from "./userAction";
import { revalidatePromoPaths } from "@/lib/cache/revalidate";
import { createClient } from "@/lib/supabase/server";
import { PromoCode } from "@/types/PromoCode";

export async function createPromoCode(
  promoCodeData: Omit<PromoCode, "id" | "created_at" | "used_count">,
): Promise<
  | { success: true; message: string; data: PromoCode }
  | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();

  try {
    const { data: existing } = await supabase
      .from("coupons")
      .select("id")
      .eq("code", promoCodeData.code)
      .maybeSingle();

    if (existing) {
      return { success: false, message: "Promo code already exists." };
    }

    const { data, error } = await supabase
      .from("coupons")
      .insert([
        {
          ...promoCodeData,
          expires_at: promoCodeData.expires_at || null,
          max_uses: promoCodeData.max_uses ?? null,
          used_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePromoPaths();
    return {
      success: true,
      message: "Promo code created successfully.",
      data: data as PromoCode,
    };
  } catch (error: any) {
    console.error("createPromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function updatePromoCode(
  id: number,
  promoCodeData: Partial<Omit<PromoCode, "id" | "created_at">>,
): Promise<
  | { success: true; message: string; data: PromoCode }
  | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();

  try {
    if (promoCodeData.code) {
      const { data: existing } = await supabase
        .from("coupons")
        .select("id")
        .eq("code", promoCodeData.code)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          message: "Another promo code with this name already exists.",
        };
      }
    }

    const { data, error } = await supabase
      .from("coupons")
      .update({
        ...promoCodeData,
        expires_at:
          promoCodeData.expires_at === undefined
            ? undefined
            : promoCodeData.expires_at || null,
        max_uses:
          promoCodeData.max_uses === undefined
            ? undefined
            : (promoCodeData.max_uses ?? null),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePromoPaths();
    return {
      success: true,
      message: "Promo code updated successfully.",
      data: data as PromoCode,
    };
  } catch (error: any) {
    console.error("updatePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function deletePromoCode(
  id: number,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();

  try {
    const { error } = await supabase.from("coupons").delete().eq("id", id);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePromoPaths();
    return { success: true, message: "Promo code deleted successfully." };
  } catch (error: any) {
    console.error("deletePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

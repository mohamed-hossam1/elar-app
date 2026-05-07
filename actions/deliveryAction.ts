"use server";

import { cacheLife, cacheTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { CACHE_TAGS } from "@/constants/cacheTages";

export const getCities = async function getCities(): Promise<
  { success: true; data: string[] } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.delivery);
  cacheLife("days");
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("delivery")
    .select("city")
    .order("city", { ascending: true });

  if (error) {
    console.error("Error fetching cities:", error);
    return { success: false, message: "Failed to fetch cities" };
  }

  const cities = data.map((item: { city: string }) => item.city);
  return { success: true, data: cities };
};

export const getDeliveryFee = async function getDeliveryFee(
  city: string,
): Promise<
  { success: true; data: number } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.delivery);
  cacheLife("days");
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("delivery")
    .select("delivery_fee")
    .eq("city", city)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching delivery fee:", error);
    return { success: false, message: "Delivery fee not found" };
  }

  return { success: true, data: data.delivery_fee as number };
};

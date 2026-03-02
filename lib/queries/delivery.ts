import { cacheLife, cacheTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { CACHE_DURATION } from "@/lib/cache/cache-life";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { verifyAdmin } from "@/actions/userAction";
import { Delivery } from "@/types/deliveryFee";

export const getCities = async function getCities(): Promise<
  { success: true; data: string[] } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.delivery);
  cacheLife(CACHE_DURATION.days);
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
  cacheLife(CACHE_DURATION.days);
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

export async function getDeliverySettings(): Promise<
  { success: true; data: Delivery[] } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  return getCachedDeliverySettings();
}

async function getCachedDeliverySettings(): Promise<
  { success: true; data: Delivery[] } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.delivery);
  cacheLife(CACHE_DURATION.hours);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("delivery")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as Delivery[] };
}

export async function getDeliverySettingById(
  id: number,
): Promise<
  { success: true; data: Delivery } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  return getCachedDeliverySettingById(id);
}

async function getCachedDeliverySettingById(
  id: number,
): Promise<
  { success: true; data: Delivery } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.delivery, CACHE_TAGS.deliverySetting(id));
  cacheLife(CACHE_DURATION.hours);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("delivery")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return { success: false, message: "Delivery setting not found" };
  }

  return { success: true, data: data as Delivery };
}

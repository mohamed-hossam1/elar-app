"use server";

import { verifyAdmin } from "./userAction";
import { revalidateDeliveryPaths } from "@/lib/cache/revalidate";
import { createClient } from "@/lib/supabase/server";
import { DeliveryInput } from "@/types/Admin";
import { Delivery } from "@/types/deliveryFee";

export async function createDeliverySetting(
  input: DeliveryInput,
): Promise<
  { success: true; data: Delivery } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const city = input.city.trim();
  if (!city) {
    return { success: false, message: "City is required." };
  }

  if (input.delivery_fee <= 0) {
    return {
      success: false,
      message: "Delivery fee must be a positive number.",
    };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("delivery")
    .select("id")
    .ilike("city", city)
    .maybeSingle();

  if (existing) {
    return { success: false, message: "City already exists." };
  }

  const { data, error } = await supabase
    .from("delivery")
    .insert({ city, delivery_fee: input.delivery_fee })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateDeliveryPaths(data.id);
  return { success: true, data: data as Delivery };
}

export async function updateDeliverySetting(
  id: number,
  input: DeliveryInput,
): Promise<
  { success: true; data: Delivery } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const city = input.city.trim();
  if (!city) {
    return { success: false, message: "City is required." };
  }

  if (input.delivery_fee <= 0) {
    return {
      success: false,
      message: "Delivery fee must be a positive number.",
    };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("delivery")
    .select("id")
    .ilike("city", city)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      message: "Another city with this name already exists.",
    };
  }

  const { data, error } = await supabase
    .from("delivery")
    .update({ city, delivery_fee: input.delivery_fee })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateDeliveryPaths(id);
  return { success: true, data: data as Delivery };
}

export async function deleteDeliverySetting(
  id: number,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { error } = await supabase.from("delivery").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateDeliveryPaths(id);
  return { success: true, message: "Delivery setting deleted successfully." };
}

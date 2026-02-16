"use server";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTages";
import { createAdminClient } from "@/lib/supabase/admin";
import { Category } from "@/types/Category";
import { verifyAdmin } from "./userAction";
import { createClient } from "@/lib/supabase/server";
import { revalidateCategoryPaths } from "@/lib/admin/revalidate";

export const getAllCategories = async function getAllCategories(): Promise<
  { success: true; data: Category[] } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife("hours");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as Category[] };
};

export async function deleteCategory(
  id: number,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { success: false, message: error.message };
  revalidateCategoryPaths();
  return { success: true, message: "Category deleted successfully." };
}

export const getCategoryById = async function getCategoryById(
  id: number,
): Promise<
  { success: true; data: Category } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.categories, CACHE_TAGS.category(id));
  cacheLife("hours");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return { success: false, message: error?.message || "Category not found" };
  }

  return { success: true, data: data as Category };
};

export async function createCategory(
  categoryData: Omit<Category, "id">,
): Promise<
  | { success: true; message: string; data: Category }
  | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select()
    .single();

  if (error) return { success: false, message: error.message };
  revalidateCategoryPaths();
  return {
    success: true,
    message: "Category created successfully.",
    data: data as Category,
  };
}

export async function updateCategory(
  id: number,
  categoryData: Partial<Omit<Category, "id">>,
): Promise<
  | { success: true; message: string; data: Category }
  | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, message: error.message };
  revalidateCategoryPaths();
  return {
    success: true,
    message: "Category updated successfully.",
    data: data as Category,
  };
}

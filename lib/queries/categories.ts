"use server"
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_DURATION } from "@/lib/cache/cache-life";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createAdminClient } from "@/lib/supabase/admin";
import { Category } from "@/types/Category";

export const getAllCategories = async function getAllCategories(): Promise<
  { success: true; data: Category[] } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife(CACHE_DURATION.hours);
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

export const getCategoryById = async function getCategoryById(
  id: number,
): Promise<
  { success: true; data: Category } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.categories, CACHE_TAGS.category(id));
  cacheLife(CACHE_DURATION.hours);
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

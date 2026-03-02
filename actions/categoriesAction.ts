"use server";

import { verifyAdmin } from "./userAction";
import { createClient } from "@/lib/supabase/server";
import { revalidateCategoryPaths } from "@/lib/cache/revalidate";
import { Category } from "@/types/Category";

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

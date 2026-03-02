"use server";

import { createClient } from "@/lib/supabase/server";

import { CreateProductInput } from "@/types/Product";
import { verifyAdmin } from "./userAction";
import { revalidateCatalogPaths } from "@/lib/cache/revalidate";

export async function deleteProduct(
  id: number,
): Promise<{ success: true } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      is_deleted: true,
      new_arrival_rank: null,
      top_selling_rank: null,
      category_rank: null,
      category_id: null,
    })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateCatalogPaths(id);
  return { success: true };
}

export async function createProduct(
  input: CreateProductInput,
): Promise<
  { success: true; data: { id: number } } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();

  if (!input.title) {
    return { success: false, message: "Title is required" };
  }

  if (!input.variants?.length) {
    return { success: false, message: "At least one variant is required" };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      title: input.title,
      description: input.description,
      category_id: input.category_id,
      image_cover: input.image_cover,
      new_arrival_rank: input.new_arrival_rank ?? null,
      top_selling_rank: input.top_selling_rank ?? null,
      category_rank: input.category_rank ?? null,
      is_deleted: false,
    })
    .select("id")
    .single();

  if (productError || !product) {
    return { success: false, message: "Failed to create product" };
  }

  const variants = input.variants.map((v) => ({
    ...v,
    product_id: product.id,
  }));

  const { error: variantsError } = await supabase
    .from("product_variants")
    .insert(variants);

  if (variantsError) {
    return { success: false, message: "Failed to create variants" };
  }

  if (input.images?.length) {
    const images = input.images.map((url) => ({
      product_id: product.id,
      url,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(images);

    if (imagesError) {
      return { success: false, message: "Failed to create images" };
    }
  }

  revalidateCatalogPaths(product.id);
  return {
    success: true,
    data: { id: product.id },
  };
}

export async function updateFullProduct(
  id: number,
  input: CreateProductInput,
): Promise<{ success: true } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();

  const { error } = await supabase.rpc("update_full_product", {
    p_id: id,
    p_title: input.title,
    p_description: input.description ?? null,
    p_category_id: input.category_id ?? null,
    p_image_cover: input.image_cover ?? null,
    p_variants: input.variants,
    p_images: input.images,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const { error: rankError } = await supabase
    .from("products")
    .update({
      new_arrival_rank: input.new_arrival_rank ?? null,
      top_selling_rank: input.top_selling_rank ?? null,
      category_rank: input.category_rank ?? null,
    })
    .eq("id", id);

  if (rankError) {
    return { success: false, message: rankError.message };
  }

  revalidateCatalogPaths(id);
  return { success: true };
}

"use server";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTages";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductDetails, ProductListItem } from "@/types/Product";

export const getNewArrivals = async function getNewArrivals(
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("*")
    .not("new_arrival_rank", "is", null)
    .eq("is_deleted", false)
    .order("new_arrival_rank", { ascending: true })
    .limit(limit);

  if (error) {
    return { success: false, message: "Failed to fetch new arrivals" };
  }

  return { success: true, data: data as ProductListItem[] };
};

export const getTopSelling = async function getTopSelling(
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("*")
    .not("top_selling_rank", "is", null)
    .eq("is_deleted", false)
    .order("top_selling_rank", { ascending: true })
    .limit(limit);

  if (error) {
    return { success: false, message: "Failed to fetch top selling" };
  }

  return { success: true, data: data as ProductListItem[] };
};

export const getProductById = async function getProductById(
  id: number,
): Promise<
  { success: true; data: ProductDetails } | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.product(id));
  cacheLife("hours");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*),
      images:product_images (*)
    `,
    )
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error || !data) {
    return { success: false, message: "Product not found" };
  }

  return { success: true, data: data as ProductDetails };
};

export const getRelatedProducts = async function getRelatedProducts(
  categoryId: number,
  productId: number,
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> {
  "use cache";
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.category(categoryId));
  cacheLife("hours");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_deleted", false)
    .neq("id", productId)
    .limit(limit);

  if (error) {
    return { success: false, message: "Failed to fetch related products" };
  }

  return { success: true, data: data as ProductListItem[] };
};


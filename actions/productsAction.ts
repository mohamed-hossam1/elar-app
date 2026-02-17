"use server";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTages";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import {
  AdminProductListItem,
  CreateProductInput,
  ProductDetails,
  ProductListingQuery,
  ProductListItem,
  ProductPaginationState,
} from "@/types/Product";
import { AdminProductFilters } from "@/types/Admin";
import { verifyAdmin } from "./userAction";
import { revalidateCatalogPaths } from "@/lib/admin/revalidate";

export const getNewArrivals = async (
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> => {
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

export const getTopSelling = async (
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> => {
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

export const getProductById = async (
  id: number,
): Promise<
  { success: true; data: ProductDetails } | { success: false; message: string }
> => {
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

export const getRelatedProducts = async (
  categoryId: number,
  productId: number,
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> => {
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

export const getProductListing = async (
  query: ProductListingQuery,
): Promise<
  | { success: true; data: ProductPaginationState }
  | { success: false; message: string }
> => {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const supabase = createAdminClient();
  const {
    search,
    category: categorySlug,
    sort,
    min_price,
    max_price,
    in_stock,
    on_sale,
    page,
    pageSize,
  } = query;

  let categoryId: number | undefined = undefined;
  if (categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (catData) {
      categoryId = catData.id;
    }
  }

  let baseQuery = supabase
    .from("products_with_min_price")
    .select("*", { count: "exact" })
    .eq("is_deleted", false);

  if (search) {
    baseQuery = baseQuery.ilike("title", `%${search}%`);
  }

  if (categoryId !== undefined) {
    baseQuery = baseQuery.eq("category_id", categoryId);
  }

  if (min_price !== undefined) {
    baseQuery = baseQuery.gte("min_price", min_price);
  }

  if (max_price !== undefined) {
    baseQuery = baseQuery.lte("min_price", max_price);
  }

  if (on_sale) {
    baseQuery = baseQuery.gt("min_price_before", 0);
  }

  if (in_stock) {
  }

  switch (sort) {
    case "price_asc":
      baseQuery = baseQuery.order("min_price", { ascending: true });
      break;
    case "price_desc":
      baseQuery = baseQuery.order("min_price", { ascending: false });
      break;
    case "top_selling":
      baseQuery = baseQuery
        .not("top_selling_rank", "is", null)
        .order("top_selling_rank", { ascending: true });
      break;
    case "new_arrivals":
      baseQuery = baseQuery
        .not("new_arrival_rank", "is", null)
        .order("new_arrival_rank", { ascending: true });
      break;
    case "newest":
    default:
      baseQuery = baseQuery.order("created_at", { ascending: false });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await baseQuery.range(from, to);

  if (error) {
    return { success: false, message: "Failed to fetch product listing" };
  }

  const total = count || 0;
  const pageCount = Math.ceil(total / pageSize);

  return {
    success: true,
    data: {
      data: data as ProductListItem[],
      total,
      page,
      pageSize,
      pageCount,
    },
  };
};

export const getProductPriceRange = async (): Promise<
  | { success: true; data: { min: number; max: number } }
  | { success: false; message: string }
> => {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("days");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("min_price")
    .eq("is_deleted", false);

  if (error || !data || data.length === 0) {
    return { success: false, message: "Failed to fetch price range" };
  }

  const prices = data.map((p) => p.min_price);
  return {
    success: true,
    data: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
  };
};

export const getProducts = async ({
  search,
  isTopSelling,
  isNewArrival,
  categoryId,
  showDeleted,
}: AdminProductFilters = {}): Promise<
  | { success: true; data: AdminProductListItem[] }
  | { success: false; message: string }
> => {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const supabase = createAdminClient();

  let query = supabase
    .from("products_with_min_price")
    .select("*, variants:product_variants(stock)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (isTopSelling) {
    query = query
      .not("top_selling_rank", "is", null)
      .order("top_selling_rank", { ascending: true });
  }

  if (isNewArrival) {
    query = query
      .not("new_arrival_rank", "is", null)
      .order("new_arrival_rank", { ascending: true });
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (!showDeleted) {
    query = query.eq("is_deleted", false);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: "Failed to fetch products" };
  }

  return { success: true, data: data as AdminProductListItem[] };
};

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

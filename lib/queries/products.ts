"use server"

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_DURATION } from "@/lib/cache/cache-life";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  AdminProductListItem,
  ProductDetails,
  ProductListingQuery,
  ProductListItem,
  ProductPaginationState,
} from "@/types/Product";
import { AdminProductFilters } from "@/types/Admin";

export const getNewArrivals = async (
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> => {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife(CACHE_DURATION.hours);

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
  cacheLife(CACHE_DURATION.hours);

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
  cacheLife(CACHE_DURATION.hours);

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
  cacheLife(CACHE_DURATION.hours);

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
  cacheLife(CACHE_DURATION.hours);

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
  cacheLife(CACHE_DURATION.days);

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
  cacheLife(CACHE_DURATION.hours);

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

"use server";

import { revalidateCatalogPaths } from "@/lib/admin/revalidate";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "./userAction";
import { RankedProduct, RankMode, RankUpdateItem } from "@/types/Rank";

const MODE_COLUMN_MAP: Record<RankMode, string> = {
  category: "category_rank",
  top_selling: "top_selling_rank",
  new_arrival: "new_arrival_rank",
};

export async function getRankedProducts(
  mode: RankMode,
  categoryId?: number,
): Promise<
  { success: true; data: RankedProduct[] } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const columnName = MODE_COLUMN_MAP[mode];

  let query = supabase
    .from("products")
    .select("id, title, image_cover, " + columnName)
    .eq("is_deleted", false)
    .not(columnName, "is", null)
    .order(columnName, { ascending: true });

  if (mode === "category" && categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: "Failed to fetch ranked products" };
  }

  const mappedData: RankedProduct[] = data.map((item: any) => ({
    id: item.id,
    title: item.title,
    image_cover: item.image_cover,
    rank: item[columnName],
  }));

  return { success: true, data: mappedData };
}

export async function saveRankedProducts(
  mode: RankMode,
  products: RankUpdateItem[],
): Promise<{ success: true } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const columnName = MODE_COLUMN_MAP[mode];

  const updates = products.map((p) =>
    supabase
      .from("products")
      .update({ [columnName]: p.rank })
      .eq("id", p.id),
  );

  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);

  if (firstError) {
    return { success: false, message: "Failed to update some ranks" };
  }

  revalidateCatalogPaths();
  return { success: true };
}

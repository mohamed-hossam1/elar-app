"use server";

import { revalidateCatalogPaths } from "@/lib/cache/revalidate";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "./userAction";
import { RankMode, RankUpdateItem } from "@/types/Rank";

type RankColumn = "category_rank" | "top_selling_rank" | "new_arrival_rank";

const MODE_COLUMN_MAP: Record<RankMode, RankColumn> = {
  category: "category_rank",
  top_selling: "top_selling_rank",
  new_arrival: "new_arrival_rank",
};

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

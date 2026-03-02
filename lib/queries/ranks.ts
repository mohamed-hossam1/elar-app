import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/actions/userAction";
import { RankedProduct, RankMode } from "@/types/Rank";

type RankColumn = "category_rank" | "top_selling_rank" | "new_arrival_rank";

const MODE_COLUMN_MAP: Record<RankMode, RankColumn> = {
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
    .select(
      "id, title, image_cover, category_rank, top_selling_rank, new_arrival_rank, created_at",
    )
    .eq("is_deleted", false);

  if (mode === "category") {
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    query = query
      .order(columnName, { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
  } else {
    query = query
      .not(columnName, "is", null)
      .order(columnName, { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: "Failed to fetch ranked products" };
  }

  const mappedData: RankedProduct[] = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    image_cover: item.image_cover,
    rank: item[columnName] ?? null,
  }));

  return { success: true, data: mappedData };
}

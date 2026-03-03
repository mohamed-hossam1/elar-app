import { getAllCategories } from "@/lib/queries/categories";
import { getRankedProducts } from "@/lib/queries/ranks";
import { AdminNotice } from "@/components/admin/AdminUI";
import RankListEditor from "@/components/admin/ranks/RankListEditor";
import { RankMode } from "@/types/Rank";

const DEFAULT_MODE: RankMode = "category";
const RANK_MODES: RankMode[] = ["category", "top_selling", "new_arrival"];

function isRankMode(value: string | null): value is RankMode {
  return value !== null && RANK_MODES.includes(value as RankMode);
}

function parseCategoryId(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function RankListContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const rawMode = params.mode;

  const mode = isRankMode(rawMode) ? rawMode : DEFAULT_MODE;
  const selectedCategoryId = parseCategoryId(params.categoryId);

  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  if (!categoriesRes.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Categories">
        {categoriesRes.message}
      </AdminNotice>
    );
  }

  const effectiveCategoryId =
    mode === "category" && selectedCategoryId === null && categories.length > 0
      ? categories[0].id
      : selectedCategoryId;

  const productsRes = await getRankedProducts(
    mode,
    effectiveCategoryId ?? undefined,
  );
  const rankedProducts = productsRes.success ? productsRes.data : [];

  if (!productsRes.success) {
    return (
      <AdminNotice tone="danger" title="Error Loading Ranked Products">
        {productsRes.message}
      </AdminNotice>
    );
  }

  return (
    <RankListEditor
      key={`${mode}:${effectiveCategoryId ?? "none"}`}
      mode={mode}
      categories={categories}
      selectedCategoryId={effectiveCategoryId}
      initialProducts={rankedProducts}
    />
  );
}

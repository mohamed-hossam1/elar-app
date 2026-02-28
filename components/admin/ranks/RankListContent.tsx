"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { getAllCategories } from "@/actions/categoriesAction";
import { getRankedProducts, saveRankedProducts } from "@/actions/ranksAction";
import {
  AdminPageHeader,
  adminSelectClassName,
} from "@/components/admin/AdminUI";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import RankModeSelector from "@/components/admin/ranks/RankModeSelector";
import RankedProductList from "@/components/admin/ranks/RankedProductList";
import AdminRankListSkeleton from "@/components/skeleton/AdminRankListSkeleton";
import { Category } from "@/types/Category";
import { RankedProduct, RankMode } from "@/types/Rank";

const DEFAULT_MODE: RankMode = "category";
const RANK_MODES: RankMode[] = ["category", "top_selling", "new_arrival"];
const EMPTY_CATEGORIES: Category[] = [];

function isRankMode(value: string | null): value is RankMode {
  return value !== null && RANK_MODES.includes(value as RankMode);
}

function parseCategoryId(value: string | null) {
  if (!value) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default function RankListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawMode = searchParams.get("mode");

  const mode = isRankMode(rawMode) ? rawMode : DEFAULT_MODE;
  const selectedCategoryId = parseCategoryId(searchParams.get("categoryId"));

  const updateRoute = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      router.replace(query ? `/admin/ranks?${query}` : "/admin/ranks");
    },
    [router, searchParams],
  );

  const categoriesQuery = useQuery({
    queryKey: ["admin-ranks-categories"],
    queryFn: () => getAllCategories(),
    staleTime: 1000 * 60 * 60,
  });

  const categories = categoriesQuery.data?.success
    ? categoriesQuery.data.data
    : EMPTY_CATEGORIES;

  useEffect(() => {
    if (categoriesQuery.data?.success === false) {
      toast.error(categoriesQuery.data.message);
    }
  }, [categoriesQuery.data]);

  useEffect(() => {
    if (mode !== "category" || categories.length === 0) return;

    const hasValidCategory = categories.some(
      (category) => category.id === selectedCategoryId,
    );

    if (!hasValidCategory) {
      updateRoute({ categoryId: String(categories[0].id) });
    }
  }, [categories, mode, selectedCategoryId, updateRoute]);

  const productsQuery = useQuery({
    queryKey: ["admin-ranks-products", mode, selectedCategoryId],
    queryFn: () => getRankedProducts(mode, selectedCategoryId ?? undefined),
    enabled: mode !== "category" || selectedCategoryId !== null,
    staleTime: 0,
  });

  useEffect(() => {
    if (productsQuery.data?.success === false) {
      toast.error(productsQuery.data.message);
    }
  }, [productsQuery.data]);

  const isLoading =
    categoriesQuery.isLoading ||
    (productsQuery.isLoading &&
      (mode !== "category" || selectedCategoryId !== null));
  const rankedProducts = productsQuery.data?.success ? productsQuery.data.data : [];

  return (
    <RankEditor
      key={`${mode}:${selectedCategoryId ?? "none"}:${productsQuery.dataUpdatedAt}`}
      mode={mode}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      initialProducts={rankedProducts}
      isLoading={isLoading}
      onRouteChange={updateRoute}
    />
  );
}

function RankEditor({
  mode,
  categories,
  selectedCategoryId,
  initialProducts,
  isLoading,
  onRouteChange,
}: {
  mode: RankMode;
  categories: Category[];
  selectedCategoryId: number | null;
  initialProducts: RankedProduct[];
  isLoading: boolean;
  onRouteChange: (updates: Record<string, string | null>) => void;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [savedProducts, setSavedProducts] = useState(initialProducts);
  const [isSaving, startSaving] = useTransition();
  const [pendingChange, setPendingChange] = useState<{
    mode?: RankMode;
    categoryId?: number;
  } | null>(null);

  const isDirty = JSON.stringify(products) !== JSON.stringify(savedProducts);

  function handleRouteChange(nextChange: { mode?: RankMode; categoryId?: number }) {
    if (isDirty) {
      setPendingChange(nextChange);
      return;
    }

    if (nextChange.mode) {
      onRouteChange({ mode: nextChange.mode });
      return;
    }

    if (typeof nextChange.categoryId === "number") {
      onRouteChange({ categoryId: String(nextChange.categoryId) });
    }
  }

  function handleSave() {
    if (!isDirty) return;

    startSaving(async () => {
      try {
        const updatePayload = products.map((product, index) => ({
          id: product.id,
          rank: index + 1,
        }));

        const removedProducts = savedProducts
          .filter(
            (savedProduct) => !products.find((product) => product.id === savedProduct.id),
          )
          .map((savedProduct) => ({
            id: savedProduct.id,
            rank: null,
          }));

        const result = await saveRankedProducts(mode, [
          ...updatePayload,
          ...removedProducts,
        ]);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Ranks saved successfully");
        setSavedProducts(products);
      } catch {
        toast.error("An error occurred while saving");
      }
    });
  }

  function handleCancel() {
    setProducts(savedProducts);
  }

  function handleRemove(id: string) {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id),
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Ranking"
        description="Manage the display order of products across category, top selling, and new arrival sections."
        actions={
          <>
            <button
              onClick={handleCancel}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-2 border border-black bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </>
        }
      />

      <div className="border border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <RankModeSelector
          currentMode={mode}
          onModeChange={(nextMode) => handleRouteChange({ mode: nextMode })}
          disabled={isSaving}
        />

        {mode === "category" && categories.length > 0 ? (
          <div className="mb-8 flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-[0.35em] text-black/45">
              Select Category
            </label>
            <div className="relative max-w-sm">
              <select
                value={selectedCategoryId ?? ""}
                onChange={(event) =>
                  handleRouteChange({
                    categoryId: Number(event.target.value),
                  })
                }
                disabled={isSaving}
                className={adminSelectClassName}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <AdminRankListSkeleton />
        ) : (
          <RankedProductList
            products={products}
            onOrderChange={setProducts}
            onRemove={mode === "top_selling" ? handleRemove : undefined}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!pendingChange}
        title="Unsaved Changes"
        description="You have unsaved changes in your product rankings. Are you sure you want to discard them and switch sections?"
        confirmLabel="Discard Changes"
        onConfirm={() => {
          if (pendingChange?.mode) {
            onRouteChange({ mode: pendingChange.mode });
          } else if (typeof pendingChange?.categoryId === "number") {
            onRouteChange({ categoryId: String(pendingChange.categoryId) });
          }

          setPendingChange(null);
        }}
        onCancel={() => setPendingChange(null)}
      />
    </div>
  );
}

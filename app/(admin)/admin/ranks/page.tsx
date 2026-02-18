"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getRankedProducts, saveRankedProducts } from "@/actions/ranksAction";
import { getAllCategories } from "@/actions/categoriesAction";
import RankModeSelector from "@/components/admin/ranks/RankModeSelector";
import RankedProductList from "@/components/admin/ranks/RankedProductList";
import { RankedProduct, RankMode } from "@/types/Rank";
import { Category } from "@/types/Category";
import { Loader2, Save, X, ChevronDown } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import AdminRankListSkeleton from "@/components/skeleton/AdminRankListSkeleton";

export default function RanksPage() {
  const [mode, setMode] = useState<RankMode>("category");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<RankedProduct[]>([]);
  const [initialProducts, setInitialProducts] = useState<RankedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();

  const [pendingChange, setPendingChange] = useState<{
    mode?: RankMode;
    categoryId?: number;
  } | null>(null);

  const isDirty = JSON.stringify(products) !== JSON.stringify(initialProducts);

  useEffect(() => {
    async function init() {
      const catResult = await getAllCategories();
      if (catResult.success) {
        setCategories(catResult.data);
        if (catResult.data.length > 0) {
          setSelectedCategoryId(catResult.data[0].id);
        }
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (mode === "category" && !selectedCategoryId) return;
    fetchProducts();
  }, [mode, selectedCategoryId]);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const result = await getRankedProducts(
        mode,
        selectedCategoryId || undefined,
      );
      if (result.success) {
        setProducts(result.data);
        setInitialProducts(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSave() {
    if (!isDirty) return;

    startSaving(async () => {
      try {
        const updatePayload = products.map((p, index) => ({
          id: p.id,
          rank: index + 1,
        }));

        const removedProducts = initialProducts
          .filter((ip) => !products.find((p) => p.id === ip.id))
          .map((ip) => ({
            id: ip.id,
            rank: null,
          }));

        const result = await saveRankedProducts(mode, [
          ...updatePayload,
          ...removedProducts,
        ]);
        if (result.success) {
          toast.success("Ranks saved successfully");
          setInitialProducts(products);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("An error occurred while saving");
      }
    });
  }

  function handleCancel() {
    setProducts(initialProducts);
  }

  function handleRemove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (isLoading && categories.length === 0) {
    return <AdminRankListSkeleton fullPage />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-satoshi font-black text-4xl uppercase tracking-tighter mb-2">
            Product Ranking
          </h1>
          <p className="text-black/60 font-medium">
            Manage the display order of products across different sections.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 px-6 py-3 font-satoshi font-bold uppercase border-2 border-black bg-white hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 px-6 py-3 font-satoshi font-black uppercase border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <RankModeSelector
        currentMode={mode}
        onModeChange={(newMode) => {
          if (isDirty) {
            setPendingChange({ mode: newMode });
          } else {
            setMode(newMode);
          }
        }}
        disabled={isSaving}
      />

      {mode === "category" && categories.length > 0 && (
        <div className="mb-8 flex flex-col gap-2">
          <label className="text-[11px] font-black uppercase tracking-[0.35em] text-black/45">
            Select Category
          </label>
          <div className="relative max-w-sm">
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => {
                const newId = Number(e.target.value);
                if (isDirty) {
                  setPendingChange({ categoryId: newId });
                } else {
                  setSelectedCategoryId(newId);
                }
              }}
              className="w-full appearance-none border-2 border-black bg-white px-4 py-3 font-satoshi font-bold uppercase tracking-tight focus:outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      )}

      {isLoading ? (
        <AdminRankListSkeleton />
      ) : (
        <RankedProductList
          products={products}
          onOrderChange={setProducts}
          onRemove={mode === "top_selling" ? handleRemove : undefined}
        />
      )}

      <ConfirmDialog
        open={!!pendingChange}
        title="Unsaved Changes"
        description="You have unsaved changes in your product rankings. Are you sure you want to discard them and switch sections?"
        confirmLabel="Discard Changes"
        onConfirm={() => {
          if (pendingChange?.mode) {
            setMode(pendingChange.mode);
          } else if (pendingChange?.categoryId) {
            setSelectedCategoryId(pendingChange.categoryId);
          }
          setPendingChange(null);
        }}
        onCancel={() => setPendingChange(null)}
      />
    </div>
  );
}

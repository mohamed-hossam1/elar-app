"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SortOption } from "@/types/Product";
import {
  serializeListingQuery,
  normalizeListingQuery,
} from "@/lib/products/listing";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { Category } from "@/types/Category";

interface ProductResultsHeaderProps {
  total: number;
  currentSort: SortOption;
  categories: Category[];
  categoryName?: string;
  onMobileFilterOpen?: () => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Selling", value: "top_selling" },
  { label: "New Arrivals", value: "new_arrivals" },
];

export default function ProductResultsHeader({
  total,
  currentSort,
  categories,
  categoryName = "All Products",
  onMobileFilterOpen,
}: ProductResultsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sort: SortOption) => {
    const params = Object.fromEntries(searchParams.entries());
    const normalizedQuery = normalizeListingQuery({
      ...params,
      sort,
      page: "1",
    });
    const queryString = serializeListingQuery(normalizedQuery);
    router.push(`/products?${queryString}`, { scroll: false });
  };

  const handleRemoveFilter = (key: string) => {
    const params = Object.fromEntries(searchParams.entries());
    if (key === "price") {
      delete params.min_price;
      delete params.max_price;
    } else {
      delete params[key];
    }
    const normalizedQuery = normalizeListingQuery(params);
    const queryString = serializeListingQuery(normalizedQuery);
    router.push(`/products?${queryString}`, { scroll: false });
  };

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Sort by";

  const activeFilters: { key: string; label: string }[] = [];

  const catSlug = searchParams.get("category");
  if (catSlug) {
    const cat = categories.find((c) => c.slug === catSlug);
    if (cat) activeFilters.push({ key: "category", label: cat.title });
  }

  const minP = searchParams.get("min_price");
  const maxP = searchParams.get("max_price");
  if (minP || maxP) {
    activeFilters.push({
      key: "price",
      label: `${minP || 0} - ${maxP || "Max"} EGP`,
    });
  }

  if (searchParams.get("in_stock") === "true") {
    activeFilters.push({ key: "in_stock", label: "In Stock" });
  }

  if (searchParams.get("on_sale") === "true") {
    activeFilters.push({ key: "on_sale", label: "On Sale" });
  }

  const search = searchParams.get("search");
  if (search) {
    activeFilters.push({ key: "search", label: `Search: ${search}` });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-integral font-black uppercase tracking-tight text-black">
            {categoryName}
          </h2>
          <p className="text-sm sm:text-base text-black/60 font-satoshi mt-1">
            Showing {total} products
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onMobileFilterOpen}
            className="lg:hidden flex items-center justify-center w-10 h-10 border border-black hover:bg-black hover:text-white transition-all active:scale-[0.98] rounded-none"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={18} />
          </button>

          <Menu
            as="div"
            className="relative inline-block text-left flex-1 sm:flex-none group"
          >
            <MenuButton className="inline-flex items-center justify-between gap-3 w-full sm:w-auto px-5 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black border border-black hover:bg-black hover:text-white transition-all active:scale-[0.98] rounded-none group">
              <span>
                Sort by:{" "}
                <span className="text-black/60 group-hover:text-white/80">
                  {activeSortLabel}
                </span>
              </span>
              <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right border border-black bg-white shadow-none focus:outline-none overflow-hidden rounded-none">
                <div className="py-1">
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value}>
                      {({ active }) => (
                        <button
                          onClick={() => handleSortChange(option.value)}
                          className={`${
                            active || currentSort === option.value
                              ? "bg-black text-white"
                              : "text-black/60 hover:bg-black/5 hover:text-black"
                          } flex w-full items-center px-4 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all`}
                        >
                          {option.label}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center gap-2 px-3 py-1.5 border border-black text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black hover:bg-black/5 transition-all rounded-none"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => handleRemoveFilter(filter.key)}
                className="hover:text-black/40 transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => router.push("/products")}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black transition-all underline underline-offset-8 decoration-black/20 hover:decoration-black ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

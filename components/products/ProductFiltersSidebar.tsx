"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { serializeListingQuery, normalizeListingQuery } from "@/lib/products/listing";
import { Category } from "@/types/Category";
import PriceRangeSlider from "./PriceRangeSlider";
import { ChevronRight } from "lucide-react";

interface ProductFiltersSidebarProps {
  categories: Category[];
  minPrice: number; 
  maxPrice: number;
  onApply?: () => void;
}


export default function ProductFiltersSidebar({
  categories,
  minPrice,
  maxPrice,
  onApply,
}: ProductFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localParams, setLocalParams] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalParams(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const activeCategory = localParams["category"];
  const inStock = localParams["in_stock"] === "true";
  const onSale = localParams["on_sale"] === "true";
  const currentMin = Number(localParams["min_price"]) || minPrice;
  const currentMax = Number(localParams["max_price"]) || maxPrice;

  const handleFilterChange = (key: string, value: string | boolean | null) => {
    const nextParams = { ...localParams };
    
    delete nextParams.page;
    
    if (value === null || value === false || value === "" || (key === "category" && value === activeCategory)) {
      delete nextParams[key];
    } else {
      nextParams[key] = value.toString();
    }
    
    setLocalParams(nextParams);
  };

  const handlePriceChange = (min: number, max: number) => {
    const nextParams = { ...localParams };
    nextParams.min_price = min.toString();
    nextParams.max_price = max.toString();
    delete nextParams.page; 
    
    setLocalParams(nextParams);
  };

  const handleApply = () => {
    const normalizedQuery = normalizeListingQuery(localParams);
    const queryString = serializeListingQuery(normalizedQuery);
    router.push(`/products?${queryString}`, { scroll: false });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (onApply) onApply();
  };

  const handleClearAll = () => {
    setLocalParams({});
    router.push("/products");
    if (onApply) onApply();
  };

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between border-b border-black pb-4">
        <h3 className="text-lg font-bold font-satoshi uppercase">Filters</h3>
        <button 
          onClick={handleClearAll}
          className="text-sm font-medium text-black/60 hover:text-black transition-colors underline underline-offset-4"
        >
          Clear All
        </button>
      </div>

      
      <div className="border-b border-black pb-6">
        <h4 className="text-sm font-bold mb-5 font-satoshi uppercase tracking-wider">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange("category", category.slug)}
              className={`flex items-center justify-between w-full text-left group transition-all py-1.5 ${
                activeCategory === category.slug 
                  ? "text-black font-bold" 
                  : "text-black/60 hover:text-black hover:translate-x-1"
              }`}
            >
              <span className="text-base">{category.title}</span>
              <ChevronRight 
                size={16} 
                className={`transition-all ${activeCategory === category.slug ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} 
              />
            </button>
          ))}
        </div>
      </div>

      
      <div className="border-b border-black pb-6">
        <h4 className="text-sm font-bold mb-2 font-satoshi uppercase tracking-wider">Price</h4>
        <PriceRangeSlider 
          min={minPrice} 
          max={maxPrice} 
          currentMin={currentMin}
          currentMax={currentMax}
          onPriceChange={handlePriceChange}
        />
      </div>

      
      <div className="border-b border-black pb-6 space-y-5">
         <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleFilterChange("in_stock", !inStock)}>
            <span className={`text-base font-medium transition-colors ${inStock ? "text-black" : "text-black/60 group-hover:text-black"}`}>In Stock</span>
            <div className={`w-11 h-6 transition-all relative ${inStock ? "bg-black" : "bg-black/10"}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white transition-transform duration-300 ${inStock ? "translate-x-5" : ""}`} />
            </div>
         </div>
         <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleFilterChange("on_sale", !onSale)}>
            <span className={`text-base font-medium transition-colors ${onSale ? "text-black" : "text-black/60 group-hover:text-black"}`}>On Sale</span>
            <div className={`w-11 h-6 transition-all relative ${onSale ? "bg-black" : "bg-black/10"}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white transition-transform duration-300 ${onSale ? "translate-x-5" : ""}`} />
            </div>
         </div>
      </div>

      <button
        className="button-primary w-full mt-2"
        onClick={handleApply}
      >
        Apply Filters
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { PackageSearch, RefreshCcw } from "lucide-react";


export default function ProductEmptyState() {
  const router = useRouter();

  const handleReset = () => {
    router.push("/products");
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-black/5 rounded-[40px] border-2 border-dashed border-black/10">
      <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
        <PackageSearch size={40} className="text-black/40" />
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-black font-satoshi uppercase mb-4">
        No Products Found
      </h2>
      
      <p className="text-black/60 max-w-md mx-auto mb-10 text-base sm:text-lg">
        We couldn&apos;t find any products matching your current filters. 
        Try adjusting your search or clearing the active filters to see more results.
      </p>

      <button
        onClick={handleReset}
        className="flex items-center gap-2 px-10 py-4 bg-black text-white rounded-full font-bold text-sm sm:text-base hover:bg-black/90 transition-all active:scale-[0.98] uppercase tracking-widest"
      >
        <RefreshCcw size={18} />
        Clear All Filters
      </button>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { serializeListingQuery, normalizeListingQuery } from "@/lib/products/listing";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  pageCount: number;
}


export default function ProductPagination({
  currentPage,
  pageCount,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  
  if (pageCount <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pageCount) return;
    
    const params = Object.fromEntries(searchParams.entries());
    const normalizedQuery = normalizeListingQuery({ ...params, page: page.toString() });
    const queryString = serializeListingQuery(normalizedQuery);
    
    
    router.push(`/products?${queryString}`, { scroll: true });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    
    
    let start = Math.max(1, currentPage - 1);
    const end = Math.min(pageCount, start + maxVisible - 1);
    
    
    if (end === pageCount) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-all ${
            currentPage === i
              ? "bg-black border-black text-white"
              : "border-black text-black/60 hover:bg-black/5 hover:text-black"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {start > 1 && (
          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 border border-black flex items-center justify-center text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black transition-all"
            >
              1
            </button>
            <span className="text-black/40 px-1">...</span>
          </div>
        )}
        {pages}
        {end < pageCount && (
          <div className="flex items-center">
            <span className="text-black/40 px-1">...</span>
            <button
              onClick={() => handlePageChange(pageCount)}
              className="w-10 h-10 border border-black flex items-center justify-center text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black transition-all"
            >
              {pageCount}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-2 px-4 py-2 border border-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all active:scale-[0.98]"
        aria-label="Previous page"
      >
        <ArrowLeft size={14} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= pageCount}
        className="flex items-center gap-2 px-4 py-2 border border-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all active:scale-[0.98]"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { serializeListingQuery, normalizeListingQuery } from "@/lib/products/listing";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react"

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
        <motion.button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-all ${
            currentPage === i
              ? "bg-black border-black text-white"
              : "border-black text-black/60 hover:bg-black/5 hover:text-black"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
          whileTap={{ scale: 0.92 }}
        >
          {i}
        </motion.button>
      );
    }

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {start > 1 && (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 border border-black flex items-center justify-center text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black transition-all"
            >
              1
            </button>
            <span className="text-black/40 px-1">...</span>
          </motion.div>
        )}
        {pages}
        {end < pageCount && (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-black/40 px-1">...</span>
            <button
              onClick={() => handlePageChange(pageCount)}
              className="w-10 h-10 border border-black flex items-center justify-center text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black transition-all"
            >
              {pageCount}
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <motion.button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-2 px-4 py-2 border border-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all active:scale-[0.98]"
        aria-label="Previous page"
        whileTap="tap"
      >
        <ArrowLeft size={14} />
        <span className="hidden sm:inline">Prev</span>
      </motion.button>

      {renderPageNumbers()}

      <motion.button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= pageCount}
        className="flex items-center gap-2 px-4 py-2 border border-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all active:scale-[0.98]"
        aria-label="Next page"
        whileTap={{ scale: 0.92 }}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={14} />
      </motion.button>
    </div>
  );
}

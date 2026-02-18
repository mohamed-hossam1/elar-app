"use client";

import { PackageOpen } from "lucide-react";

export default function RankEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-black/5 border-2 border-dashed border-black/20 text-center">
      <PackageOpen className="w-12 h-12 text-black/20 mb-4" />
      <h3 className="font-satoshi font-bold text-xl uppercase mb-2">
        No Products Found
      </h3>
      <p className="text-black/60 max-w-sm">
        There are no products currently assigned to this ranking mode. 
        Add products to this category or collection to start ranking.
      </p>
    </div>
  );
}

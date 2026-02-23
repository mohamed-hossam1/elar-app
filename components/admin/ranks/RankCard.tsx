"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import Image from "@/components/imageKit/ImageOptimization";
import { RankedProduct } from "@/types/Rank";

interface RankCardProps {
  product: RankedProduct;
  index: number;
  onRemove?: (id: string) => void;
}

export default function RankCard({ product, index, onRemove }: RankCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 p-4 bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
        isDragging ? "shadow-none translate-x-[2px] translate-y-[2px]" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-black/5 transition-colors"
      >
        <GripVertical className="w-5 h-5 text-black/40 group-hover:text-black" />
      </div>

      <div className="flex items-center gap-2 font-black text-xl w-8">
        {index + 1}
      </div>

      <div className="relative w-16 h-20 border border-black overflow-hidden shrink-0">
        <Image
          fill
          src={product.image_cover || "/images/default-fallback.png"}
          alt={product.title}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-satoshi font-bold text-lg truncate uppercase tracking-tight">
          {product.title}
        </h3>
      </div>

      {onRemove && (
        <button
          onClick={() => onRemove(product.id)}
          className="p-2 text-black/20 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-600"
          title="Remove from ranking"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

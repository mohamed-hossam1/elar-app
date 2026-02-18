"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RankedProduct } from "@/types/Rank";
import RankCard from "./RankCard";
import RankEmptyState from "./RankEmptyState";

interface RankedProductListProps {
  products: RankedProduct[];
  onOrderChange: (newProducts: RankedProduct[]) => void;
  onRemove?: (id: string) => void;
}

export default function RankedProductList({
  products,
  onOrderChange,
  onRemove,
}: RankedProductListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      onOrderChange(arrayMove(products, oldIndex, newIndex));
    }
  }

  if (products.length === 0) {
    return <RankEmptyState />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={products} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {products.map((product, index) => (
            <RankCard
              key={product.id}
              product={product}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

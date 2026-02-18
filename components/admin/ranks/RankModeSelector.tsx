"use client";

import { RankMode } from "@/types/Rank";

interface RankModeSelectorProps {
  currentMode: RankMode;
  onModeChange: (mode: RankMode) => void;
  disabled?: boolean;
}

const MODES: { value: RankMode; label: string }[] = [
  { value: "category", label: "Category" },
  { value: "top_selling", label: "Top Selling" },
  { value: "new_arrival", label: "New Arrival" },
];

export default function RankModeSelector({
  currentMode,
  onModeChange,
  disabled,
}: RankModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          disabled={disabled}
          className={`px-8 py-3 font-satoshi font-black uppercase tracking-tighter transition-all border-2 border-black ${
            currentMode === mode.value
              ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1"
              : "bg-white text-black hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

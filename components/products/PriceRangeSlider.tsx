"use client";

import { useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onPriceChange: (min: number, max: number) => void;
}


export default function PriceRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  onPriceChange,
}: PriceRangeSliderProps) {
  
  const safeMin = min ?? 0;
  const safeMax = max ?? 1000;
  
  const [minVal, setMinVal] = useState(currentMin ?? safeMin);
  const [maxVal, setMaxVal] = useState(currentMax ?? safeMax);

  const [prevCurrentMin, setPrevCurrentMin] = useState(currentMin);
  const [prevCurrentMax, setPrevCurrentMax] = useState(currentMax);

  if (currentMin !== prevCurrentMin || currentMax !== prevCurrentMax) {
    setPrevCurrentMin(currentMin);
    setPrevCurrentMax(currentMax);
    setMinVal(currentMin ?? safeMin);
    setMaxVal(currentMax ?? safeMax);
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
  };

  const triggerChange = () => {
    onPriceChange(minVal, maxVal);
  };

  
  const minPercent = ((minVal - safeMin) / (safeMax - safeMin)) * 100;
  const maxPercent = ((maxVal - safeMin) / (safeMax - safeMin)) * 100;

  return (
    <div className="space-y-6 pt-4">
      <div className="relative h-1.5 bg-black/10 rounded-full">
        
        <div 
          className="absolute h-full bg-black rounded-full"
          style={{ 
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%` 
          }}
        />
        
        
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          value={minVal}
          onChange={handleMinChange}
          onMouseUp={triggerChange}
          onTouchEnd={triggerChange}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        />
        
        
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          value={maxVal}
          onChange={handleMaxChange}
          onMouseUp={triggerChange}
          onTouchEnd={triggerChange}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        />
      </div>
      
      <div className="flex items-center justify-between text-sm font-bold font-satoshi">
        <span className="bg-black/5 px-3 py-1 rounded-full">{minVal} EGP</span>
        <span className="bg-black/5 px-3 py-1 rounded-full">{maxVal} EGP</span>
      </div>
    </div>
  );
}

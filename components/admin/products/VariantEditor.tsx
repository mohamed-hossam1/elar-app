"use client";

import { useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { adminInputClassName } from "@/components/admin/AdminUI";

export interface VariantDraft {
  color: string;
  size: string;
  sku: string;
  price: number | "";
  price_before: number | "";
  stock: number | "";
}

interface VariantEditorProps {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
  errors?: Record<string, string>;
}

export default function VariantEditor({
  variants,
  onChange,
  errors = {},
}: VariantEditorProps) {
  
  const [quickColors, setQuickColors] = useState<string[]>([]);
  const [newQuickColor, setNewQuickColor] = useState("#000000");
  const [quickSizes, setQuickSizes] = useState<string[]>(["S", "M", "L", "XL", "XXL"]);
  const [quickPrice, setQuickPrice] = useState<number | "">("");
  const [quickPriceBefore, setQuickPriceBefore] = useState<number | "">("");
  const [quickStock, setQuickStock] = useState<number | "">("");

  const commonSizes = ["S", "M", "L", "XL", "XXL", "Free Size"];

  const generateVariants = () => {
    if (quickColors.length === 0 || quickSizes.length === 0) return;
    
    const newVariants: VariantDraft[] = [];
    quickColors.forEach(color => {
      quickSizes.forEach(size => {
        newVariants.push({
          color,
          size,
          sku: "",
          price: quickPrice,
          price_before: quickPriceBefore,
          stock: quickStock
        });
      });
    });

    onChange([...variants.filter(v => v.color !== "" || v.size !== ""), ...newVariants]);
    setQuickColors([]);
  };

  const addVariant = () => {
    onChange([
      ...variants,
      { color: "", size: "", sku: "", price: "", price_before: "", stock: "" },
    ]);
  };

  const duplicateVariant = (index: number) => {
    const next = [...variants];
    next.splice(index + 1, 0, { ...next[index] });
    onChange(next);
  };

  const updateVariant = (index: number, field: keyof VariantDraft, value: string | number) => {
    const next = [...variants];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeVariant = (index: number) => {
    const next = [...variants];
    next.splice(index, 1);
    onChange(next);
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all variants?")) {
      onChange([]);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="border-2 border-black bg-black/2 p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 bg-black" />
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Bulk Variant Generator</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/45 block">
              1. Add Colors ({quickColors.length})
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {quickColors.map((color, i) => (
                <div key={i} className="group relative h-10 w-10 border border-black p-0.5 bg-white">
                  <div className="h-full w-full" style={{ backgroundColor: color }} />
                  <button 
                    type="button"
                    onClick={() => setQuickColors(quickColors.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center bg-black text-white text-[8px] border border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative h-11 w-11 shrink-0 border border-black bg-white p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <input 
                  type="color" 
                  value={newQuickColor}
                  onChange={(e) => setNewQuickColor(e.target.value.toUpperCase())}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                <div 
                  className="h-full w-full border border-black/10" 
                  style={{ backgroundColor: newQuickColor }} 
                />
              </div>
              <input
                type="text"
                placeholder="#000000"
                value={newQuickColor}
                onChange={(e) => setNewQuickColor(e.target.value.toUpperCase())}
                className="h-11 w-32 border border-black bg-white px-3 text-xs font-bold uppercase tracking-wider focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (newQuickColor && !quickColors.includes(newQuickColor)) {
                    setQuickColors([...quickColors, newQuickColor]);
                  }
                }}
                className="h-11 px-4 border border-black bg-white text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
              >
                Add Color
              </button>
            </div>
          </div>

          
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/45 block">
              2. Add Sizes ({quickSizes.length})
            </label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {quickSizes.map((size, i) => (
                <div key={i} className="group relative px-3 py-1.5 bg-black text-white text-[10px] font-bold border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                  {size}
                  <button 
                    type="button"
                    onClick={() => setQuickSizes(quickSizes.filter((_, idx) => idx !== i))}
                    className="ml-2 text-white/50 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pb-4 border-b border-black/5">
              <span className="text-[9px] font-bold text-black/30 w-full mb-1 uppercase tracking-tighter">Presets:</span>
              {commonSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (!quickSizes.includes(size)) {
                      setQuickSizes([...quickSizes, size]);
                    }
                  }}
                  className="px-2 py-1 text-[9px] font-bold border border-black/10 hover:border-black transition-colors bg-white text-black/60 hover:text-black"
                >
                  + {size}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Custom Size (e.g. 42)"
                id="custom-size-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value && !quickSizes.includes(input.value)) {
                      setQuickSizes([...quickSizes, input.value]);
                      input.value = "";
                    }
                  }
                }}
                className="h-11 flex-1 border border-black bg-white px-3 text-xs font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("custom-size-input") as HTMLInputElement;
                  if (input.value && !quickSizes.includes(input.value)) {
                    setQuickSizes([...quickSizes, input.value]);
                    input.value = "";
                  }
                }}
                className="h-11 px-4 border border-black bg-white text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
              >
                Add Size
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-black/5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">Base Price</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={quickPrice}
              onChange={(e) => setQuickPrice(e.target.value ? parseFloat(e.target.value) : "")}
              className={adminInputClassName} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">Base Price Before</label>
            <input 
              type="number" 
              placeholder="Optional"
              value={quickPriceBefore}
              onChange={(e) => setQuickPriceBefore(e.target.value ? parseFloat(e.target.value) : "")}
              className={adminInputClassName} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">Base Stock</label>
            <input 
              type="number" 
              placeholder="0"
              value={quickStock}
              onChange={(e) => setQuickStock(e.target.value ? parseInt(e.target.value) : "")}
              className={adminInputClassName} 
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={generateVariants}
              disabled={quickColors.length === 0 || quickSizes.length === 0}
              className="w-full h-11.5 border border-black bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] transition hover:bg-white hover:text-black disabled:opacity-20"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
            Individual Variants ({variants.length})
          </h3>
          {variants.length > 0 && (
            <button 
              type="button" 
              onClick={clearAll}
              className="text-[9px] font-bold uppercase tracking-widest text-red-600 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 border border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Add Single row
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="relative border border-black p-4 pt-10 sm:pt-4"
          >
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => duplicateVariant(index)}
                className="text-black/35 transition hover:text-black"
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={variants.length === 1}
                className="text-black/35 transition hover:text-red-600 disabled:opacity-0"
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Color (Hex)
                </label>
                <div className="flex gap-2">
                  <div className="relative h-11 w-11 shrink-0 border border-black bg-white p-1">
                    <input
                      type="color"
                      value={variant.color.match(/^#[0-9A-Fa-f]{6}$/) ? variant.color : "#000000"}
                      onChange={(e) => updateVariant(index, "color", e.target.value.toUpperCase())}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div 
                      className="h-full w-full border border-black/10" 
                      style={{ backgroundColor: variant.color.match(/^#[0-9A-Fa-f]{3,6}$/) ? variant.color : "#000000" }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="#FFFFFF"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, "color", e.target.value)}
                    className={adminInputClassName}
                  />
                </div>
                {errors[`variant.${index}.color`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. XL"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.size`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  className={adminInputClassName}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value ? parseFloat(e.target.value) : "")}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.price`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Price Before
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price_before}
                  onChange={(e) => updateVariant(index, "price_before", e.target.value ? parseFloat(e.target.value) : "")}
                  className={adminInputClassName}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, "stock", e.target.value ? parseInt(e.target.value) : "")}
                  className={adminInputClassName}
                />
                {errors[`variant.${index}.stock`] && (
                  <p className="text-[10px] font-bold text-red-600">Required</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {variants.length === 0 && (
          <div className="border border-dashed border-black/20 p-8 text-center">
            <p className="text-sm font-medium text-black/40">
              No variants added. At least one is required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

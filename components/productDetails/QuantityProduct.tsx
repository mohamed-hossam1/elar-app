"use client";

import { useCart } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductDetails, ProductVariant } from "@/types/Product";
import Toast from "@/components/ui/Toast";
import { egpFormatter } from "@/lib/format/currency";
import { Minus, Plus } from "lucide-react";

export default function QuantityProduct({ product }: { product: ProductDetails }) {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  
  const variants = product.variants || [];
  const colors = Array.from(
    new Set(variants.map((v: ProductVariant) => v.color)),
  );

  const SIZE_ORDER = ["s", "m", "l", "xl", "xxl"];

  const getSortedSizesForColor = (color: string) => {
    return variants
      .filter((v: ProductVariant) => v.color === color)
      .map((v: ProductVariant) => v.size)
      .sort((a, b) => {
        const indexA = SIZE_ORDER.indexOf(a.toLowerCase());
        const indexB = SIZE_ORDER.indexOf(b.toLowerCase());

        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      });
  };

  const initialColor = colors[0] || "";
  const initialSizes = getSortedSizesForColor(initialColor);
  const initialSize = initialSizes[0] || "";

  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const availableSizes = getSortedSizesForColor(selectedColor);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const sortedSizes = getSortedSizesForColor(color);

    if (!sortedSizes.includes(selectedSize)) {
      setSelectedSize(sortedSizes[0]);
    }
    setQuantity(1);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const selectedVariant = variants.find(
    (v: ProductVariant) => v.color === selectedColor && v.size === selectedSize,
  );

  const stock = selectedVariant?.stock || 0;
  const price = selectedVariant?.price || 0;
  const isOutOfStock = stock === 0;
  const isMaxQuantity = quantity >= stock;

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const onSubmit = async () => {
    if (isOutOfStock || !selectedVariant) return;

    setIsLoading(true);
    try {
      const res = await addToCart({
        variant: { ...selectedVariant, product },
        quantity,
      });

      if (res && !res.success) {
        setToast({
          show: true,
          message: res.message || "Failed to add to cart",
          type: "error",
        });
        return;
      }

      setToast({
        show: true,
        message: "Product added to cart successfully",
        type: "success",
      });

      setQuantity(1);
    } catch (e: any) {
      setToast({
        show: true,
        message: e.message || "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-satoshi">
      <div className="space-y-8 mb-10">
        {!isOutOfStock && (
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black tracking-tighter font-integral">
                {egpFormatter.format(price * quantity)}
              </span>
              {selectedVariant?.price_before && (
                <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
                  -{(((Number(selectedVariant.price_before) - price) / Number(selectedVariant.price_before)) * 100).toFixed(0)}%
                </span>
              )}
            </div>
            {selectedVariant?.price_before && (
              <span className="text-lg text-black/60 line-through font-medium font-integral decoration-red-500/50">
                {egpFormatter.format(Number(selectedVariant.price_before) * quantity)}
              </span>
            )}
          </div>
        )}

        <div className="h-px bg-gray-100 w-full" />

        {colors.length > 0 && (
          <div>
            <p className="text-black/60 mb-4 font-bold uppercase text-xs tracking-[0.15em]">
              Select Color
            </p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const isColorOutOfStock = variants
                  .filter((v: ProductVariant) => v.color === color)
                  .every((v: ProductVariant) => v.stock === 0);

                return (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    title={isColorOutOfStock ? `${color} - Sold Out` : color}
                    className={`relative w-10 h-10 border border-black transition-all flex items-center justify-center ${
                      selectedColor === color
                        ? "ring-2 ring-black ring-offset-2"
                        : "hover:scale-105"
                    } ${isColorOutOfStock ? "opacity-40 grayscale" : ""}`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <div
                        className={`w-3 h-3 ${
                          color.toLowerCase() === "#ffffff" ||
                          color.toLowerCase() === "white"
                            ? "bg-black"
                            : "bg-white"
                        }`}
                      />
                    )}
                    {isColorOutOfStock && (
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-80"
                        style={{
                          background: "linear-gradient(45deg, transparent 49%, white 49%, white 51%, transparent 51%)"
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="pt-2">
            <p className="text-black/60 mb-4 font-bold uppercase text-xs tracking-[0.15em]">
              Choose Size
            </p>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => {
                const isSizeOutOfStock = variants.find(
                  (v: ProductVariant) => v.color === selectedColor && v.size === size
                )?.stock === 0;

                const lineColor = selectedSize === size ? "white" : "black";

                return (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`relative px-5 md:px-8 py-3 border border-black transition-all font-bold text-xs uppercase tracking-widest overflow-hidden ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-50"
                    } ${isSizeOutOfStock ? "opacity-60" : ""}`}
                  >
                    <span className="relative z-10">{size}</span>
                    {isSizeOutOfStock && (
                      <div 
                        className="absolute inset-0 pointer-events-none z-20 "
                        style={{
                          background: `linear-gradient(to top left, transparent 49%, ${lineColor} 49%, ${lineColor} 51%, transparent 51%)`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      

      
      <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10 md:mb-10">
        
        <div className="flex items-center justify-between border border-black px-6 py-4 bg-white sm:w-40 h-14">
          <button
            className="flex items-center justify-center hover:opacity-50 transition-opacity p-1 disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1 || isOutOfStock}
          >
            <Minus className="size-5" strokeWidth={2.5} />
          </button>

          <span className="font-bold text-xl text-black w-8 text-center select-none font-integral">
            {isOutOfStock ? 0 : quantity}
          </span>

          <button
            className="flex items-center justify-center hover:opacity-50 transition-opacity p-1 disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={handleIncrease}
            disabled={isMaxQuantity || isOutOfStock}
          >
            <Plus className="size-5" strokeWidth={2.5} />
          </button>
        </div>

        
        <button
          className={`hidden sm:flex flex-1 py-4 px-8 font-black text-sm uppercase tracking-[0.2em] transition-all justify-center items-center border border-black h-14 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-white hover:text-black"
          }`}
          onClick={onSubmit}
          disabled={isLoading || isOutOfStock}
        >
          {isLoading ? (
            <div className="h-6 w-6 border-2 border-black/30 border-t-black animate-spin"></div>
          ) : isOutOfStock ? (
            "Sold Out"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>

      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4 z-100 sm:hidden flex gap-4 items-center animate-in slide-in-from-bottom duration-300">
        {!isOutOfStock && (
          <div className="flex flex-col pr-2 border-r border-black/10 min-w-[100px]">
            <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Total</span>
            <span className="text-lg font-black font-integral tracking-tighter leading-none">
              {egpFormatter.format(price * quantity)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <button
            className={`w-full py-4 px-6 font-black text-sm uppercase tracking-[0.2em] transition-all flex justify-center items-center border border-black ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white active:scale-[0.98]"
            }`}
            onClick={onSubmit}
            disabled={isLoading || isOutOfStock}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin"></div>
            ) : isOutOfStock ? (
              "Sold Out"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>

      {!isOutOfStock && isMaxQuantity && (
        <p className="text-sm text-red-500 font-bold mb-4">
          Only {stock} available in stock for this variant!
        </p>
      )}

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

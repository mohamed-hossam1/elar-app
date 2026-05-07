"use client";

import ROUTES from "@/constants/routes";
import { useCart } from "@/stores/cartStore";
import Image from "@/components/imageKit/ImageOptimization";
import Link from "next/link";
import OrderSummary from "./OrderSummary";
import CartSkeleton from "../skeleton/CartSkeleton";
import { useUser } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { egpFormatter } from "@/lib/format/currency";

export default function CartList() {
  const {
    cart,
    quantity,
    removeFromCart,
    updateQuantity,
    updateQuantityLocal,
    price,
    clearCart,
    isLoading,
    hasHydrated,
  } = useCart();

  const debounceTimer = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    return () => {
      Object.values(debounceTimer.current).forEach(clearTimeout);
    };
  }, []);

  const { mutate: syncQuantity } = useMutation({
    mutationFn: async ({
      variantId,
      newQty,
    }: {
      variantId: number;
      newQty: number;
    }) => {
      const res = await updateQuantity(variantId, newQty);
      if (res && !res.success) {
        throw new Error(res.message || "Failed to update quantity.");
      }
      return res;
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleRemove = async (variantId: number) => {
    const res = await removeFromCart(variantId);
    if (res && !res.success) {
      toast.error(res.message || "Failed to remove item.");
    }
  };

  const handleUpdateQuantity = (
    variantId: number,
    currentQty: number,
    delta: number
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    updateQuantityLocal(variantId, newQty);

    if (debounceTimer.current[variantId]) {
      clearTimeout(debounceTimer.current[variantId]);
    }

    debounceTimer.current[variantId] = setTimeout(() => {
      syncQuantity({ variantId, newQty });
      delete debounceTimer.current[variantId];
    }, 500);
  };

  const handleClearCart = async () => {
    const res = await clearCart();
    if (res && !res.success) {
      toast.error(res.message || "Failed to clear cart.");
    } else if (res && res.success) {
      toast.success("Cart cleared successfully.");
    }
  };

  const isUserInitialized = useUser((state) => state.isInitialized);

  if (!hasHydrated || isLoading || cart === null || !isUserInitialized) {
    return <CartSkeleton />;
  }

  const cartEntries = cart ? Object.entries(cart) : [];
  const hasItems = cartEntries.length > 0;

  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10 font-satoshi">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold uppercase font-integral">Shopping Cart</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2 md:mt-3">
          {quantity} item{quantity !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-4">
          <div className="flex flex-row justify-between items-center mb-4 md:mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-bold">Cart Items</h2>
            <button
              className="text-red-500 font-bold cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 text-xs md:text-sm uppercase tracking-widest"
              onClick={handleClearCart}
              disabled={!hasItems}
            >
              Clear Cart
            </button>
          </div>

          {hasItems ? (
            <div className="border border-black bg-white">
              {cartEntries.map(([key, value], index) => {
                const variantId = Number(key);
                const stock = value.variant.stock || 0;
                const price_after = value.variant.price || 0;
                const isMaxQuantity = value.quantity >= stock;
                const isOutOfStock = stock === 0;

                return (
                  <div
                    key={variantId}
                    className="p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 relative bg-white border border-black flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src={value.variant.product?.image_cover || ""}
                        alt={value.variant.product.title}
                        priority={index === 0}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link
                            className="font-bold text-base md:text-lg text-gray-900 hover:text-primary transition-colors block truncate"
                            href={`/products/${value.variant.product.id}`}
                          >
                            {value.variant.product.title}
                          </Link>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs md:text-sm">
                            <p className="text-gray-600">
                              <span className="font-medium text-gray-900">Size:</span> {value.variant.size}
                            </p>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span className="font-medium text-gray-900">Color:</span>
                              <div
                                className="w-5 h-5 border border-black shadow-none ring-2 ring-transparent hover:ring-black/20"
                                style={{ backgroundColor: value.variant.color }}
                                title={value.variant.color}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          className="text-black/30 hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
                          title="Remove item"
                          onClick={() => handleRemove(variantId)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-between mt-4 md:mt-6 gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center border border-black px-4 py-2 space-x-4">
                            <button
                              className="text-gray-900 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={value.quantity <= 1}
                              onClick={() => handleUpdateQuantity(variantId, value.quantity, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="font-bold text-sm md:text-base text-gray-900 w-6 text-center select-none">
                              {value.quantity}
                            </span>

                            <button
                              className="text-gray-900 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => handleUpdateQuantity(variantId, value.quantity, 1)}
                              disabled={isMaxQuantity || isOutOfStock}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {(isMaxQuantity || isOutOfStock) && (
                            <p className="text-xs text-red-500 mt-2 font-medium">
                              {isOutOfStock
                                ? "Out of Stock"
                                : `Max available: ${stock}`}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-black text-lg md:text-xl text-black">
                            {egpFormatter.format(price_after * value.quantity)}
                          </p>
                          <p className="text-xs md:text-sm font-medium text-black/60">
                            {egpFormatter.format(price_after)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-black p-12 text-center bg-white">
              <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-900 text-xl font-black mb-2 uppercase font-integral tracking-widest">Your cart is empty</p>
              <p className="text-black/60 mb-8 max-w-xs mx-auto font-satoshi uppercase tracking-wider text-[10px] leading-relaxed">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-block bg-black text-white px-8 py-4 font-bold border border-black hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs"
              >
                Start Shopping
              </Link>
            </div>
          )}

          {hasItems && (
            <div className="mt-8">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity"
              >
                <ArrowLeft className="size-4" />
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        <OrderSummary price={price} isCart={true} deliveryFee={0} />
      </div>
    </div>
  );
}

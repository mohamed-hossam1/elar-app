"use client";

import ROUTES from "@/constants/routes";
// import { useCart } from "@/stores/cartStore";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function CartIcon() {
  // const { quantity } = useCart();
  const [quantity, setQuantity] = useState<number | null>(null);
  setQuantity(0)
  return (
    <div>
      <Link
        className="relative p-1 text-black transition-all duration-300"
        href={ROUTES.CART}
        aria-label="View Shopping Cart"
      >
        <ShoppingCart className="w-6 h-6 hover:text-black/70 transition-colors" />
        <span className="sr-only">Shopping Cart</span>
        {quantity !== 0 && (
          <div className="absolute top-4 -right-5 bg-black text-white w-4 h-4 flex justify-center items-center text-[10px] border-none">
            {quantity}
          </div>
        )}
      </Link>
    </div>
  );
}

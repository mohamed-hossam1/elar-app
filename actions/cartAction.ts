"use server";

import { createClient } from "@/lib/supabase/server";
import { Cart } from "@/types/Cart";

export async function getOrCreateCart(guestId?: string): Promise<
  | { success: true; data: Cart }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("carts").select("*");

  if (user) {
    query = query.eq("user_id", user.id);
  } else if (guestId) {
    query = query.eq("guest_id", guestId).is("user_id", null);
  } else {
    return { success: false, message: "No user or guest ID provided" };
  }

  const { data: existingCart } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingCart) {
    return { success: true, data: existingCart as Cart };
  }

  const { data: newCart, error } = await supabase
    .from("carts")
    .insert([
      {
        user_id: user?.id || null,
        guest_id: user ? null : guestId || null,
      },
    ])
    .select()
    .single();

  if (error || !newCart) {
    return { success: false, message: "Failed to create cart" };
  }

  return { success: true, data: newCart as Cart };
}

export async function addToCart(
  variantId: number,
  quantity: number,
  guestId?: string
): Promise<| { success: true; message: string } | { success: false; message: string }> {
  const supabase = await createClient();

  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("stock, product:products(title, is_deleted)")
    .eq("id", variantId)
    .single();

  if (variantError || !variant) {
    return { success: false, message: "Product variant not found" };
  }

  const product = variant.product as any;
  if (product?.is_deleted) {
    return { success: false, message: "Product not available" };
  }

  const stock = variant.stock;

  const cartRes = await getOrCreateCart(guestId);
  if (!cartRes.success) return cartRes;
  if (!cartRes.data) return { success: false, message: "Cart data not found" };

  const cartId = cartRes.data.id;

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("variant_id", variantId)
    .maybeSingle();

  const currentQty = existingItem ? existingItem.quantity : 0;
  const newQty = currentQty + quantity;

  if (newQty > stock) {
    return {
      success: false,
      message: `Only ${stock} items available in stock.`,
    };
  }

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existingItem.id);

    if (error) return { success: false, message: "Failed to update quantity" };
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert([{ cart_id: cartId, variant_id: variantId, quantity }]);

    if (error) return { success: false, message: "Failed to add item to cart" };
  }

  return { success: true, message: "Item added to cart" };
}

export async function getCart(guestId?: string): Promise<
  | { success: true; data: Cart }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("carts").select(
    `
      *,
      items:cart_items (
        *,
        variant:product_variants (
          *,
          product:products (id, title, image_cover, is_deleted)
        )
      )
    `
  );

  if (user) {
    query = query.eq("user_id", user.id);
  } else if (guestId) {
    query = query.eq("guest_id", guestId).is("user_id", null);
  } else {
    return { success: false, message: "No user or guest ID provided" };
  }

  const { data: cart, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !cart) {
    return { success: false, message: "Cart not found" };
  }

  const rawCart = cart as any;
  const invalidItemIds: number[] = [];

    if (rawCart.items) {
    rawCart.items = rawCart.items.filter((item: any) => {
      const isInvalid = !item.variant || !item.variant.product || item.variant.product.is_deleted;
      if (isInvalid) {
        invalidItemIds.push(item.id);
      }
      return !isInvalid;
    });

    if (invalidItemIds.length > 0) {
      await supabase.from("cart_items").delete().in("id", invalidItemIds);
    }
  }

  return { success: true, data: rawCart as Cart };
}

export async function removeFromCart(itemId: number): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) return { success: false, message: "Failed to remove item" };
  return { success: true, message: "Item removed" };
}

export async function updateQuantity(itemId: number, quantity: number): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  const supabase = await createClient();

  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("variant_id")
    .eq("id", itemId)
    .single();

  if (itemError || !item) {
    return { success: false, message: "Item not found in cart" };
  }

  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("stock")
    .eq("id", item.variant_id)
    .single();

  if (variantError || !variant) {
    return { success: false, message: "Product variant not found" };
  }

  if (quantity > variant.stock) {
    return {
      success: false,
      message: `Only ${variant.stock} items available in stock.`,
    };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) return { success: false, message: "Failed to update quantity" };
  return { success: true, message: "Quantity updated" };
}

export async function clearCart(guestId?: string): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  const cartRes = await getOrCreateCart(guestId);
  if (!cartRes.success) return cartRes;
  if (!cartRes.data) return { success: false, message: "Cart data not found" };

  const cartId = cartRes.data.id;
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId);

  if (error) return { success: false, message: "Failed to clear cart" };
  return { success: true, message: "Cart cleared" };
}

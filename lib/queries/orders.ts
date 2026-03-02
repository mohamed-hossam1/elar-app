import { createClient } from "@/lib/supabase/server";
import { AdminOrderFilters } from "@/types/Admin";
import { Order } from "@/types/Order";
import { verifyAdmin } from "@/actions/userAction";

export async function getAdminOrders(
  filters: AdminOrderFilters = {},
): Promise<
  { success: true; data: Order[] } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const {
    search,
    status,
    paymentMethod,
    customerType,
    dateFrom,
    dateTo,
    userId,
  } = filters;

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items (*, variant:product_variants(stock))
    `,
    )
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (paymentMethod) {
    query = query.eq("payment_method", paymentMethod);
  }

  if (customerType === "guest") {
    query = query.is("user_id", null);
  } else if (customerType === "user") {
    query = query.not("user_id", "is", null);
  }

  if (dateFrom) {
    query = query.gte("created_at", `${dateFrom}T00:00:00`);
  }

  if (dateTo) {
    query = query.lte("created_at", `${dateTo}T23:59:59.999`);
  }

  if (search) {
    const trimmed = search.trim();
    if (/^\d+$/.test(trimmed)) {
      query = query.or(`id.eq.${trimmed},user_name.ilike.%${trimmed}%`);
    } else {
      query = query.ilike("user_name", `%${trimmed}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as Order[] };
}

export async function getAdminOrderById(
  orderId: number,
): Promise<
  { success: true; data: Order } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items (*, variant:product_variants(stock))
    `,
    )
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return { success: false, message: "Order not found" };
  }

  return { success: true, data: data as Order };
}

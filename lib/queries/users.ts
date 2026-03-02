import { verifyAdmin } from "@/actions/userAction";
import { createClient } from "@/lib/supabase/server";
import { AdminUserFilters } from "@/types/Admin";
import { User } from "@/types/User";

export async function GetUser(): Promise<
  { success: true; data: User } | { success: false; message: string }
> {
  const subabase = await createClient();
  const response = await subabase.auth.getUser();
  if (response.data.user?.id) {
    const { data: userProfile, error } = await subabase
      .from("users")
      .select("*")
      .eq("id", response.data.user?.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error);
      return { success: false, message: "Profile not found" };
    }

    if (!userProfile) return { success: false, message: "User not found" };
    return { success: true, data: userProfile as User };
  }
  return { success: false, message: "User not authenticated" };
}

export async function getAdminUsers(
  filters: AdminUserFilters = {},
): Promise<
  { success: true; data: User[] } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { search, role, dateFrom, dateTo } = filters;

  if (dateFrom && dateTo && dateFrom > dateTo) {
    return { success: false, message: "From date cannot be after To date" };
  }

  let query = supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    const term = search.trim();
    query = query.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
    );
  }

  if (role) {
    query = query.eq("role", role);
  }

  if (dateFrom) {
    query = query.gte("created_at", `${dateFrom}T00:00:00`);
  }

  if (dateTo) {
    query = query.lte("created_at", `${dateTo}T23:59:59.999`);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as User[] };
}

export async function getAdminUserById(
  userId: string,
): Promise<
  { success: true; data: User } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return { success: false, message: "User not found" };
  }

  return { success: true, data: data as User };
}

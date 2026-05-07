"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types/User";

interface UserData {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

export async function SignUpSupabase({
  name,
  email,
  password,
  phone,
}: UserData): Promise<{ success: true } | { success: false; message: string }> {
  const supabase = await createClient();

  const { data: authUser, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { success: false, message: signUpError.message };
  }

  const userId = authUser?.user?.id || "";

  const { error: addUserError } = await supabase
    .from("users")
    .insert({ id: userId, name, phone, email, role: "user" });

  if (addUserError) {
    DeleteUser(userId);
    return { success: false, message: addUserError.message };
  }

  return { success: true };
}

export async function SignInSupabase({
  email,
  password,
}: Pick<UserData, "email" | "password">): Promise<
  { success: true } | { success: false; message: string }
> {
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) return { success: false, message: signInError.message };
  return { success: true };
}

export async function SignOutSupabase(): Promise<
  { success: true } | { success: false; message: string }
> {
  const supabase = await createClient();
  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) return { success: false, message: signOutError.message };
  return { success: true };
}

export async function DeleteUser(
  id: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const admin = createAdminClient();
  const res = await admin.auth.admin.deleteUser(id);
  if (res.error) return { success: false, message: res.error.message };
  return { success: true };
}

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

"use server";

import { ADMIN_ROLES } from "@/lib/admin";
import { revalidateUserPaths } from "@/lib/cache/revalidate";
import { getCurrentUserProfile, isAdminRole } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  AdminRole,
  DeleteUserAccessPayload,
} from "@/types/Admin";
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

export async function UpdateUserProfile({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}): Promise<{ success: true } | { success: false; message: string }> {
  const supabase = await createClient();
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser.user) {
    return { success: false, message: "User not authenticated" };
  }

  const userId = authUser.user.id;

  const { error: userTableError } = await supabase
    .from("users")
    .update({ name, phone })
    .eq("id", userId);

  if (userTableError) {
    return { success: false, message: "Failed to update profile details" };
  }

  if (email !== authUser.user.email) {
    const { error: authUpdateError } = await supabase.auth.updateUser({
      email: email,
    });

    if (authUpdateError) {
      return { success: false, message: "Failed to update email address" };
    }
  }

  return { success: true };
}

export async function UpdateUserPassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ success: true } | { success: false; message: string }> {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser.user) {
    return { success: false, message: "User not authenticated" };
  }

  const email = authUser.user.email;

  if (!email) {
    return { success: false, message: "User email not found in session." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email,
    password: oldPassword,
  });

  if (signInError) {
    return { success: false, message: "Incorrect old password." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  await supabase.auth.signOut();

  return { success: true };
}

export async function verifyAdmin(): Promise<
  { success: true; user: User } | { success: false; message: string }
> {
  const user = await getCurrentUserProfile();

  if (!user) {
    return { success: false, message: "User not authenticated" };
  }

  if (!isAdminRole(user.role)) {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  return { success: true, user };
}

export async function updateUserRole(
  userId: string,
  role: AdminRole,
): Promise<
  { success: true; data: User } | { success: false; message: string }
> {
  let currentAdmin: User;
  const verification = await verifyAdmin();
  if (!verification.success) return verification;
  currentAdmin = verification.user;

  if (!ADMIN_ROLES.includes(role)) {
    return { success: false, message: "Invalid role selected." };
  }

  if (currentAdmin.id === userId && role !== "admin") {
    return {
      success: false,
      message: "You cannot remove your own admin access.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateUserPaths(userId);
  return { success: true, data: data as User };
}

export async function deleteUserAccess(
  userId: string,
  payload: DeleteUserAccessPayload,
): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  let currentAdmin: User;
  const verification = await verifyAdmin();
  if (!verification.success) return verification;
  currentAdmin = verification.user;

  if (currentAdmin.id === userId) {
    return { success: false, message: "You cannot remove your own access." };
  }

  if (!payload.confirmRemoval) {
    return {
      success: false,
      message: "Explicit confirmation required to remove access.",
    };
  }

  const result = await DeleteUser(userId);
  if (!result.success) {
    return result;
  }

  revalidateUserPaths(userId);
  return {
    success: true,
    message:
      "User access removed successfully. Historical commerce records have been preserved.",
  };
}

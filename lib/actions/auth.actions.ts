"use server";

import { createClient } from "@/lib/supabase/server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- 1. SIGN OUT ---
export async function signOut() {
  // 1. Initialize the secure server-side Supabase client
  const supabase = await createClient();

  // 2. Tell Supabase to destroy the current user's session
  await supabase.auth.signOut();

  // 3. Redirect the user back to the login page
  redirect("/login");
}

export async function createStaffUser(data: {
  full_name: string;
  email: string;
  password: string;
  role: string;
  mobile_number: string;
}) {
  try {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Failed to create user credentials.");

    const { error: dbError } = await supabaseAdmin.from("users").insert([
      {
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        mobile_number: data.mobile_number,
      },
    ]);

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error("Failed to save user profile: " + dbError.message);
    }

    revalidatePath("/users");

    return { success: true };
  } catch (error: any) {
    console.error("User Creation Error:", error);
    return { error: error.message || "Failed to create user." };
  }
}
export async function updateStaffUser(id: string, data: any) {
  const supabase = await createClient();
  await supabase.from("users").update(data).eq("id", id);
  revalidatePath("/users");
}

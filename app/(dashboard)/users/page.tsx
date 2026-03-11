import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersListClient from "@/components/users/UsersListClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: currentUserProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentUserProfile?.role !== "Admin") {
    redirect("/");
  }

  const { data: staff } = await supabase
    .from("users")
    .select("*")
    .order("full_name");

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      <UsersListClient initialUsers={staff || []} />
    </div>
  );
}

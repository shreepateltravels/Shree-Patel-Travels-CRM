import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = userData?.role || "Staff";

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      <Sidebar userRole={userRole} />

      {/* This container listens for the 'data-collapsed' attribute on the Sidebar.
          It switches from ml-64 (256px) to ml-20 (80px) smoothly.
      */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ml-64 has-[aside[data-collapsed=true]]:ml-20">
        <main className="flex-1 overflow-hidden p-4 flex flex-col [&>*]:h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

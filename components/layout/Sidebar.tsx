"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  PhoneCall,
  CalendarClock,
  Users,
  MapPin,
  UserCog,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth.actions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Simple utility for merging tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, adminOnly: false },
  { name: "Enquiry", href: "/leads", icon: PhoneCall, adminOnly: false },
  {
    name: "Follow Ups",
    href: "/follow-ups",
    icon: CalendarClock,
    adminOnly: false,
  },
  { name: "Customers", href: "/customers", icon: Users, adminOnly: false },
  { name: "Cities", href: "/cities", icon: MapPin, adminOnly: false },
  { name: "Users", href: "/users", icon: UserCog, adminOnly: true },
];

interface SidebarProps {
  userRole: string;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-dashboard-border flex flex-col fixed left-0 top-0 z-50">
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-14 border-b border-dashboard-border">
        <Image
          src="/SPT.png"
          alt="Shree Patel Travels"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Role-based access control
          if (item.adminOnly && userRole !== "Admin") return null;

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand/10 text-brand shadow-sm" // Modern active state
                  : "text-muted hover:bg-slate-50 hover:text-dashboard-text",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-brand" : "text-muted",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout Area */}
      <div className="p-4 border-t border-dashboard-border">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-muted hover:bg-danger/5 hover:text-danger transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

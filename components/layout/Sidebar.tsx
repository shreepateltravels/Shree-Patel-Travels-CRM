"use client";

import { useState } from "react";
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
  Ticket,
  ChevronLeft, // Less than icon
  Menu, // 3-bar icon
} from "lucide-react";
import { signOut } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Enquiry", href: "/leads", icon: PhoneCall },
  { name: "Follow Ups", href: "/follow-ups", icon: CalendarClock },
  { name: "Confirmed Bookings", href: "/confirmed", icon: Ticket },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Cities", href: "/cities", icon: MapPin },
  { name: "Users", href: "/users", icon: UserCog, adminOnly: true },
];

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "h-screen bg-white border-r border-dashboard-border flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* HEADER AREA */}
      <div className="h-20 flex items-center px-4 border-b border-dashboard-border relative">
        <div className="flex-1 flex items-center justify-between overflow-hidden">
          {isCollapsed ? (
            /* COLLAPSED: 3-Bar Menu Icon */
            <div
              className="mx-auto cursor-pointer text-slate-500 hover:text-[#3da9d4] transition-colors"
              onClick={() => setIsCollapsed(false)}
            >
              <Menu size={24} strokeWidth={2} />
            </div>
          ) : (
            /* EXPANDED: Logo + Less Than Icon */
            <>
              <Image
                src="/SPT.png"
                alt="Logo"
                width={180}
                height={100}
                className="object-contain transition-opacity duration-300 opacity-100 ml-3"
              />
              <button
                onClick={() => setIsCollapsed(true)}
                className="cursor-pointer text-slate-400 hover:text-[#3da9d4] transition-all p-1"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          if (item.adminOnly && userRole !== "Admin") return null;
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                isActive
                  ? "bg-[#3da9d4]/10 text-[#3da9d4]"
                  : "text-slate-500 hover:bg-slate-50",
                isCollapsed && "justify-center px-0",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-[#3da9d4]" : "group-hover:text-[#3da9d4]",
                )}
              />
              <span
                className={cn(
                  "truncate transition-all duration-300 ease-in-out",
                  isCollapsed
                    ? "w-0 opacity-0 invisible"
                    : "w-auto opacity-100 visible",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 cursor-pointer",
            isCollapsed && "justify-center px-0",
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={cn(
              "transition-all duration-300",
              isCollapsed
                ? "w-0 opacity-0 invisible"
                : "w-auto opacity-100 visible",
            )}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

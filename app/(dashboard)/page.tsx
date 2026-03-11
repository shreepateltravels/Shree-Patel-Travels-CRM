import {
  List,
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Bell,
  Bus,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/lead.actions";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const data = stats || {
    total: 0,
    open: 0,
    followUp: 0,
    completed: 0,
    cancelled: 0,
    autoClosed: 0,
    todaysFollowUps: 0,
    upcomingJourneys: 0,
  };

  const cards = [
    {
      title: "Total Leads",
      value: data.total,
      icon: List,
      color: "hover:border-[#3da9d4]",
      iconColor: "text-[#3da9d4]",
      bg: "bg-[#3da9d4]/10",
    },
    {
      title: "Open Leads",
      value: data.open,
      icon: FolderOpen,
      color: "hover:border-indigo-400",
      iconColor: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: "Follow Up Leads",
      value: data.followUp,
      icon: Clock,
      color: "hover:border-amber-400",
      iconColor: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Completed Leads",
      value: data.completed,
      icon: CheckCircle,
      color: "hover:border-emerald-500",
      iconColor: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Cancelled Leads",
      value: data.cancelled,
      icon: XCircle,
      color: "hover:border-rose-500",
      iconColor: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      title: "Auto Closed Leads",
      value: data.autoClosed,
      icon: Archive,
      color: "hover:border-slate-500",
      iconColor: "text-slate-500",
      bg: "bg-slate-100",
    },
    {
      title: "Today's Follow Ups",
      value: data.todaysFollowUps,
      icon: Bell,
      color: "hover:border-orange-500",
      iconColor: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Upcoming Journeys",
      value: data.upcomingJourneys,
      icon: Bus,
      color: "hover:border-teal-500",
      iconColor: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 8 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`saas-card p-6 group hover:-translate-y-1 transition-all duration-300 border-b-4 border-transparent ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 saas-card p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Recent Activity
          </h2>
          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentLeads.map((lead: any) => (
                <div
                  key={lead.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {lead.customer_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {lead.customer_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lead.mobile_number}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      lead.status === "Booked"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[200px]">
              <List className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">
                No activity recorded yet.
              </p>
            </div>
          )}
        </div>

        {/* QUICK LINKS */}
        <div className="saas-card p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h2>
          <div className="space-y-3">
            {[
              {
                label: "View All Leads",
                href: "/leads",
                hover: "hover:bg-[#3da9d4]/10 hover:text-[#3da9d4]",
              },
              {
                label: "Check Follow-ups",
                href: "/follow-ups",
                hover: "hover:bg-amber-50 hover:text-amber-600",
              },
              {
                label: "Customer Directory",
                href: "/customers",
                hover: "hover:bg-emerald-50 hover:text-emerald-600",
              },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between w-full p-4 text-sm text-slate-700 bg-slate-50 rounded-xl transition-colors border border-slate-100 font-medium group ${link.hover}`}
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

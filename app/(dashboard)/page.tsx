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
  ArrowRight,
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
        <div className="lg:col-span-2 saas-card p-0 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Activity
            </h2>
          </div>

          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">No</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Route</th>
                    <th className="px-6 py-4 font-semibold">Journey Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentLeads.map((lead: any) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                            {lead.customer_name[0]}
                          </div>
                          <p className="font-bold text-slate-800">
                            {lead.customer_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {lead.mobile_number}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                            lead.type === "Ticket"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          {lead.from_city?.name}
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          {lead.to_city?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {new Date(lead.journey_date).toLocaleDateString(
                          "en-GB",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[250px]">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <List className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                No activity recorded yet.
              </p>
            </div>
          )}
        </div>

        {/* QUICK LINKS */}
        <div className="saas-card p-6 h-fit">
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

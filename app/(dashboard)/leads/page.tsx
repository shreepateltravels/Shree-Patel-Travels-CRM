import LeadForm from "@/components/leads/LeadForm";
import LeadList from "@/components/leads/LeadList";
import { getLeads, getCities } from "@/lib/actions/lead.actions";

export default async function LeadsPage() {
  // 1. Fetch ALL leads from the database
  const allLeads = await getLeads();
  const cities = await getCities();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-144px)] animate-in fade-in duration-500">
      <div className="flex-1 min-h-0 h-full overflow-hidden">
        {/* 2. Pass ALL leads directly to the list. 
             Default status is "" (All Statuses) so nothing disappears! */}
        <LeadList
          initialLeads={allLeads}
          defaultStatus=""
          cities={cities}
          showCityFilters={true}
        />
      </div>

      {/* CHANGES MADE HERE:
         - Removed: bg-white, rounded-xl, shadow-sm, border, border-slate-100
         - Kept: lg:w-[400px], shrink-0, min-h-0, h-full (to maintain layout structure)
         - Changed: overflow-hidden to overflow-y-auto (to ensure the form button is accessible if it gets tall)
      */}
      <div className="w-full lg:w-[400px] shrink-0 min-h-0 h-full overflow-y-auto custom-scrollbar">
        <LeadForm />
      </div>
    </div>
  );
}

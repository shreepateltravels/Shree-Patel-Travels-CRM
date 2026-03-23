import LeadForm from "@/components/enquiry/LeadForm";
import LeadList from "@/components/enquiry/LeadList";
import { getLeads, getCities } from "@/lib/actions/lead.actions";

export default async function LeadsPage() {
  const allLeads = await getLeads();
  const cities = await getCities();

  return (
    // CHANGED: gap-6 is now gap-3
    <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-144px)] animate-in fade-in duration-500">
      <div className="flex-1 min-h-0 h-full overflow-hidden">
        <LeadList
          initialLeads={allLeads}
          defaultStatus=""
          cities={cities}
          showCityFilters={true}
        />
      </div>

      <div className="w-full lg:w-[400px] shrink-0 min-h-0 h-full overflow-y-auto custom-scrollbar">
        <LeadForm />
      </div>
    </div>
  );
}

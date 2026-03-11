export const dynamic = "force-dynamic";

import LeadList from "@/components/leads/LeadList";
import { getFollowUpLeads, getCities } from "@/lib/actions/lead.actions";

export default async function FollowUpsPage() {
  const followUpLeads = await getFollowUpLeads();
  const cities = await getCities();

  return (
    <div className="flex flex-col h-[calc(100vh-144px)] animate-in fade-in duration-500">
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <LeadList
          initialLeads={followUpLeads}
          cities={cities}
          showCityFilters={true}
          showStatusFilter={false}
          emptyMessage="No follow-ups scheduled at the moment."
        />
      </div>
    </div>
  );
}

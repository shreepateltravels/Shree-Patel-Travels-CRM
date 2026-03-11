import LeadList from "@/components/leads/LeadList";
import { getConfirmedLeads, getCities } from "@/lib/actions/lead.actions";

export const dynamic = "force-dynamic";

export default async function ConfirmedBookingsPage() {
  const confirmedLeads = await getConfirmedLeads();
  const cities = await getCities();

  return (
    <div className="flex flex-col h-full gap-4">
      {/* TABLE COMPONENT */}
      <div className="flex-1 min-h-0">
        <LeadList
          initialLeads={confirmedLeads}
          cities={cities}
          defaultStatus="Booked"
          showStatusFilter={false}
          emptyMessage="No confirmed bookings found yet."
        />
      </div>
    </div>
  );
}

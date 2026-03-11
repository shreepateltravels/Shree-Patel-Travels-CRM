import LeadList from "@/components/leads/LeadList";
import { getConfirmedLeads, getCities } from "@/lib/actions/lead.actions";

export const dynamic = "force-dynamic";

export default async function ConfirmedBookingsPage() {
  const confirmedLeads = await getConfirmedLeads();
  const cities = await getCities();

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-slate-50/50">
      <div className="flex flex-col gap-1">
        {/* Updated Titles to reflect both Tickets and Parcels */}
        <h1 className="text-2xl font-bold text-slate-800">
          Confirmed Bookings
        </h1>
        <p className="text-sm text-slate-500">
          View all successfully booked tickets and parcels.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <LeadList
          initialLeads={confirmedLeads}
          cities={cities}
          defaultStatus="Booked"
          showStatusFilter={false}
          emptyMessage="No confirmed bookings found yet." // Updated empty message
        />
      </div>
    </div>
  );
}

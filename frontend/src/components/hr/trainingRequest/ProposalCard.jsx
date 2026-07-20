import { CalendarDays } from "lucide-react";

export default function ProposalCard({
  proposal,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-[#4453F2] transition"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
          {proposal.status}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-800">
        {proposal.proposal_title}
      </h2>

      <p className="text-gray-500 mt-2">
        Submitted by{" "}
        {proposal.submitter?.full_name ?? "-"}
      </p>

      <div className="flex gap-5 text-gray-500 text-sm mt-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />

          {proposal.submitted_date
            ? new Date(
                proposal.submitted_date
              ).toLocaleDateString()
            : "-"}
        </div>
      </div>
    </button>
  );
}
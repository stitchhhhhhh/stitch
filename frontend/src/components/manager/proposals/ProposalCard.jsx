import {
  Calendar,
  Building2,
  Pencil,
} from "lucide-react";

function getStatusLabel(status) {
  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    revision: "Revision Required",
  };

  return labels[status] || "Unknown";
}

export default function ProposalCard({
  proposal,
  onView,
  onEdit,
}) {
  const statusColor = {
    pending:
      "bg-yellow-100 text-yellow-700",
    approved:
      "bg-green-100 text-green-700",
    rejected:
      "bg-red-100 text-red-700",
    revision:
      "bg-blue-100 text-blue-700",
  };

  const canEdit = [
    "pending",
    "revision",
  ].includes(proposal.status);

  return (
    <article className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5">
        <span
          className={`inline-flex px-4 py-1 rounded-full text-xs font-semibold ${
            statusColor[proposal.status] ||
            "bg-gray-100 text-gray-600"
          }`}
        >
          {getStatusLabel(
            proposal.status
          )}
        </span>
      </div>

      <div className="px-6 flex-1">
        <h2 className="text-2xl font-bold text-gray-800">
          {proposal.title}
        </h2>

        <p className="text-gray-500 mt-3 whitespace-pre-wrap">
          {proposal.description ||
            "No description available."}
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex gap-2 items-center text-gray-500">
            <Building2 size={16} />

            <span>
              {proposal.department}
            </span>
          </div>

          <div className="flex gap-2 items-center text-gray-500">
            <Calendar size={16} />

            <span>{proposal.date}</span>
          </div>
        </div>

        {proposal.reviewNote && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">
              HR Review Note
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {proposal.reviewNote}
            </p>
          </div>
        )}
      </div>

      <div className="border-t mt-6 px-6 py-5 flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={() =>
            onView(proposal)
          }
          className="text-[#3E4BEB] font-semibold hover:underline"
        >
          View Details
        </button>

        {canEdit && (
          <button
            type="button"
            onClick={() =>
              onEdit(proposal)
            }
            className="flex items-center gap-2 text-gray-600 hover:text-[#3E4BEB]"
          >
            <Pencil size={18} />

            {proposal.status ===
            "revision"
              ? "Revise and Resubmit"
              : "Edit"}
          </button>
        )}

        {proposal.status ===
          "approved" && (
          <span className="text-sm font-medium text-green-600">
            Program created
          </span>
        )}
      </div>
    </article>
  );
}

import {
  Calendar,
  Building2,
  Pencil,
  RotateCcw,
  Trash2,
  Play,
} from "lucide-react";

export default function ProposalCard({
  proposal,
  onView,
  onEdit,
  onResubmit,
  onDelete,
  onSubmitHR,
}) {
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    revision: "bg-blue-100 text-blue-700",
    draft: "bg-gray-100 text-gray-600",
  };

  const priorityColor = {
    high: "bg-red-100 text-red-600",
    medium: "bg-blue-100 text-blue-600",
    low: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="flex justify-between p-5">
        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
            statusColor[proposal.status] || statusColor.draft
          }`}
        >
          {proposal.statusLabel}
        </span>

        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
            priorityColor[proposal.priority] || priorityColor.medium
          }`}
        >
          {proposal.priority} Priority
        </span>
      </div>

      <div className="px-6 flex-1">
        <h2 className="text-3xl font-bold text-gray-800">
          {proposal.title}
        </h2>

        <p className="text-gray-500 mt-3">
          {proposal.description}
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex gap-2 items-center text-gray-500">
            <Building2 size={16} />
            {proposal.department}
          </div>

          <div className="flex gap-2 items-center text-gray-500">
            <Calendar size={16} />
            {proposal.date}
          </div>
        </div>
      </div>

      <div className="border-t mt-6 px-6 py-5 flex justify-between items-center">
        <button
          type="button"
          onClick={() => onView(proposal)}
          className="text-[#3E4BEB] font-semibold hover:underline"
        >
          View Details
        </button>

        {proposal.status === "pending" && (
          <button
            type="button"
            onClick={() => onEdit(proposal)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#3E4BEB]"
          >
            <Pencil size={18} />
            Edit
          </button>
        )}

        {proposal.status === "approved" && (
          <span className="text-green-600 font-medium">
            Ready to Enroll
          </span>
        )}

        {proposal.status === "revision" && (
          <button
            type="button"
            onClick={() => onSubmitHR(proposal)}
            className="bg-[#3E4BEB] text-white rounded-xl px-4 py-2 flex gap-2 items-center"
          >
            <Play size={15} />
            Submit to HR
          </button>
        )}

        {proposal.status === "draft" && (
          <button
            type="button"
            onClick={() => onDelete(proposal)}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        )}

        {proposal.status === "rejected" && (
          <button
            type="button"
            onClick={() => onResubmit(proposal)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#3E4BEB]"
          >
            <RotateCcw size={18} />
            Re-submit
          </button>
        )}
      </div>
    </div>
  );
}
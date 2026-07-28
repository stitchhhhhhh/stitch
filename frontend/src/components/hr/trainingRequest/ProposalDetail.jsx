import { reviewProposal } from "../../../services/trainerService";

export default function ProposalDetail({
  proposal,
  onRefresh,
}) {
  if (!proposal) {
    return (
      <div className="bg-white rounded-3xl p-10">
        No proposal selected
      </div>
    );
  }

const handleReview = async (status) => {
  if (!proposal) return;

  const actionLabel =
    status === "approved"
      ? "approve"
      : "reject";

  const confirmed = window.confirm(
    `Are you sure you want to ${actionLabel} proposal "${proposal.proposal_title}"?`
  );

  if (!confirmed) return;

  try {
    await reviewProposal(
      proposal.id,
      status
    );

    alert(
      status === "approved"
        ? "The proposal was approved successfully."
        : "The proposal was rejected successfully."
    );

    if (onRefresh) {
      await onRefresh();
    }
  } catch (err) {
    console.error(err);

    alert(
      err?.message ||
        "Failed to update the proposal."
    );
  }
};

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <h2 className="text-4xl font-bold">
        {proposal.proposal_title}
      </h2>

      <p className="text-gray-500 mt-3">
        Submitted by {proposal.submitter?.full_name}
      </p>

      <div className="mt-8">

        <h3 className="font-bold mb-3">
          Description
        </h3>

        <p className="text-gray-600">
          {proposal.description}
        </p>

      </div>

      <div className="mt-8">

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
          {proposal.status}
        </span>

      </div>

      {proposal.status === "pending" && (
        <div className="grid grid-cols-2 gap-4 mt-8">

          <button
          type="button"
            onClick={() =>
              handleReview("approved")
            }
            className="bg-green-600 text-white py-3 rounded-xl"
          >
            Approve
          </button>

          <button
          type="button"
            onClick={() =>
              handleReview("rejected")
            }
            className="bg-red-600 text-white py-3 rounded-xl"
          >
            Reject
          </button>

        </div>
      )}

    </div>
  );
}

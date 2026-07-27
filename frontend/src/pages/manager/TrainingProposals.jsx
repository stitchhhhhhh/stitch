import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Plus } from "lucide-react";

import ProposalStatCard from "../../components/manager/proposals/ProposalStatCard";
import ProposalCard from "../../components/manager/proposals/ProposalCard";

import {
  getManagerProposals,
  createManagerProposal,
  updateManagerProposal,
} from "../../services/managerService";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

const emptyForm = {
  proposal_title: "",
  description: "",
};

export default function TrainingProposals() {
  const [proposals, setProposals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [
    selectedProposal,
    setSelectedProposal,
  ] = useState(null);

  const [
    editingProposalId,
    setEditingProposalId,
  ] = useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  async function loadProposals() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getManagerProposals();

      setProposals(
        Array.isArray(data) ? data : []
      );
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Failed to load proposals"
      );

      setProposals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProposals();
  }, []);

  function openCreateForm() {
    setEditingProposalId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingProposalId(null);
    setFormData(emptyForm);
  }

  function handleEdit(proposal) {
    setEditingProposalId(
      proposal.id
    );

    setFormData({
      proposal_title:
        proposal.proposal_title || "",
      description:
        proposal.description || "",
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const proposalTitle =
      formData.proposal_title.trim();

    if (!proposalTitle) {
      setError(
        "Proposal title is required"
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        proposal_title:
          proposalTitle,
        description:
          formData.description.trim(),
      };

      if (editingProposalId) {
        await updateManagerProposal(
          editingProposalId,
          payload
        );
      } else {
        await createManagerProposal(
          payload
        );
      }

      closeForm();
      await loadProposals();
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Failed to save proposal"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const stats = useMemo(
    () => [
      {
        title: "Pending",
        value: proposals.filter(
          (proposal) =>
            proposal.status ===
            "pending"
        ).length,
        icon: "💬",
        bgColor:
          "bg-yellow-100",
      },
      {
        title: "Approved",
        value: proposals.filter(
          (proposal) =>
            proposal.status ===
            "approved"
        ).length,
        icon: "✅",
        bgColor:
          "bg-green-100",
      },
      {
        title: "Rejected",
        value: proposals.filter(
          (proposal) =>
            proposal.status ===
            "rejected"
        ).length,
        icon: "❌",
        bgColor:
          "bg-red-100",
      },
      {
        title: "Revision",
        value: proposals.filter(
          (proposal) =>
            proposal.status ===
            "revision"
        ).length,
        icon: "📝",
        bgColor:
          "bg-blue-100",
      },
    ],
    [proposals]
  );

  const normalizedProposals =
    useMemo(
      () =>
        proposals.map(
          (proposal) => ({
            ...proposal,
            title:
              proposal.proposal_title ||
              "Untitled Proposal",
            department:
              proposal.department
                ?.department_name ||
              "No department",
            date: formatDate(
              proposal.submitted_date
            ),
            reviewNote:
              proposal.review_note ||
              "",
          })
        ),
      [proposals]
    );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-5">
        <div>
          <h1 className="text-5xl font-bold">
            Training Proposals
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Create and manage department
            training requests.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="bg-[#3E4BEB] text-white rounded-2xl px-8 py-4 flex gap-3 items-center shadow-lg"
        >
          <Plus size={20} />
          Create New Proposal
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 border space-y-4"
        >
          <div>
            <label
              htmlFor="proposal-title"
              className="block text-sm font-semibold mb-2"
            >
              Proposal Title
            </label>

            <input
              id="proposal-title"
              type="text"
              required
              maxLength={255}
              value={
                formData.proposal_title
              }
              onChange={(event) =>
                setFormData(
                  (current) => ({
                    ...current,
                    proposal_title:
                      event.target.value,
                  })
                )
              }
              className="border rounded-xl p-3 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="proposal-description"
              className="block text-sm font-semibold mb-2"
            >
              Description
            </label>

            <textarea
              id="proposal-description"
              rows={5}
              value={
                formData.description
              }
              onChange={(event) =>
                setFormData(
                  (current) => ({
                    ...current,
                    description:
                      event.target.value,
                  })
                )
              }
              className="border rounded-xl p-3 w-full"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingProposalId
                  ? "Save and Submit"
                  : "Submit Proposal"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="border px-5 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <ProposalStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
          Loading proposals...
        </div>
      ) : normalizedProposals.length ===
        0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
          No training proposals
          available.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {normalizedProposals.map(
            (proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onView={
                  setSelectedProposal
                }
                onEdit={handleEdit}
              />
            )
          )}
        </div>
      )}

      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-2xl font-bold text-[#253B80]">
                {selectedProposal.title}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedProposal(
                    null
                  )
                }
                className="text-gray-500 text-2xl hover:text-black"
                aria-label="Close proposal details"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-gray-600 whitespace-pre-wrap">
              {selectedProposal.description ||
                "No description available."}
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <p>
                Status:{" "}
                <span className="font-semibold">
                  {selectedProposal.status ||
                    "-"}
                </span>
              </p>

              <p>
                Department:{" "}
                <span className="font-semibold">
                  {selectedProposal.department}
                </span>
              </p>

              <p>
                Submitted:{" "}
                <span className="font-semibold">
                  {selectedProposal.date}
                </span>
              </p>

              {selectedProposal.reviewNote && (
                <div className="pt-3">
                  <p className="font-semibold text-gray-700">
                    HR Review Note
                  </p>

                  <p className="mt-1">
                    {
                      selectedProposal.reviewNote
                    }
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedProposal(null)
              }
              className="mt-6 w-full bg-[#3E4BEB] text-white py-3 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

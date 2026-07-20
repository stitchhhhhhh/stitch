import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import ProposalStatCard from "../../components/manager/proposals/ProposalStatCard";
import ProposalCard from "../../components/manager/proposals/ProposalCard";

import {
  getProposals,
  createProposal,
} from "../../services/trainerService";

export default function TrainingProposals() {
  const [proposals, setProposals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
const [editingProposalId, setEditingProposalId] = useState(null);
  const [formData, setFormData] = useState({
    proposal_title: "",
    description: "",
  });

  const loadProposals = async () => {
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProposal(formData);

      setFormData({
        proposal_title: "",
        description: "",
      });

      setShowForm(false);

      await loadProposals();

    } catch (err) {
      alert(err.message);
    }
  };

function handleView(proposal) {
  setSelectedProposal(proposal);
}

function handleEdit(proposal) {
  setEditingProposalId(proposal.id);

  setFormData({
    proposal_title:
      proposal.proposal_title ||
      proposal.title ||
      "",
    description: proposal.description || "",
  });

  setShowForm(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function handleResubmit(proposal) {
  const confirmed = window.confirm(
    `Kirim ulang proposal "${
      proposal.title || proposal.proposal_title
    }"?`
  );

  if (!confirmed) return;

  alert(
    "Tombol Re-submit sudah aktif, tetapi endpoint backend untuk mengubah status belum tersedia."
  );
}

function handleSubmitHR(proposal) {
  const confirmed = window.confirm(
    `Submit proposal "${
      proposal.title || proposal.proposal_title
    }" ke HR?`
  );

  if (!confirmed) return;

  alert(
    "Tombol Submit to HR sudah aktif, tetapi endpoint backend belum dihubungkan."
  );
}

function handleDelete(proposal) {
  const confirmed = window.confirm(
    `Hapus draft "${
      proposal.title || proposal.proposal_title
    }"?`
  );

  if (!confirmed) return;

  setProposals((current) =>
    current.filter(
      (item) => item.id !== proposal.id
    )
  );

  alert("Draft dihapus dari tampilan.");
}
  
  const stats = [
    {
      title: "Pending",
      value: proposals.filter(
        (p) => p.status === "pending"
      ).length,
      icon: "💬",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Approved",
      value: proposals.filter(
        (p) => p.status === "approved"
      ).length,
      icon: "✅",
      bgColor: "bg-green-100",
    },
    {
      title: "Rejected",
      value: proposals.filter(
        (p) => p.status === "rejected"
      ).length,
      icon: "❌",
      bgColor: "bg-red-100",
    },
    {
      title: "Revision",
      value: proposals.filter(
        (p) => p.status === "revision"
      ).length,
      icon: "📝",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-5xl font-bold">
            Training Proposals
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Create and manage department training requests.
          </p>

{selectedProposal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
    <div className="bg-white rounded-3xl p-8 w-full max-w-xl">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-2xl font-bold text-[#253B80]">
          {selectedProposal.title ||
            selectedProposal.proposal_title ||
            "Proposal Details"}
        </h2>

        <button
          type="button"
          onClick={() => setSelectedProposal(null)}
          className="text-gray-500 text-2xl hover:text-black"
        >
          ×
        </button>
      </div>

      <p className="mt-5 text-gray-600">
        {selectedProposal.description ||
          "No description available."}
      </p>

      <div className="mt-6 space-y-2 text-sm text-gray-500">
        <p>
          Status:{" "}
          <span className="font-semibold">
            {selectedProposal.status || "-"}
          </span>
        </p>

        <p>
          Department:{" "}
          <span className="font-semibold">
            {selectedProposal.department || "Department"}
          </span>
        </p>

        <p>
          Date:{" "}
          <span className="font-semibold">
            {selectedProposal.date || "-"}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSelectedProposal(null)}
        className="mt-6 w-full bg-[#3E4BEB] text-white py-3 rounded-xl"
      >
        Close
      </button>
    </div>
  </div>
)}

        </div>

        
          <button
  type="button"
  onClick={() => {
    setEditingProposalId(null);

    setFormData({
      proposal_title: "",
      description: "",
    });

    setShowForm(true);
  }}
          className="bg-[#3E4BEB] text-white rounded-2xl px-8 py-4 flex gap-3 items-center shadow-lg"
        >
          <Plus size={20} />
          Create New Proposal
        </button>

      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 border"
        >
          <input
            type="text"
            placeholder="Proposal Title"
            value={formData.proposal_title}
            onChange={(e) =>
              setFormData({
                ...formData,
                proposal_title: e.target.value,
              })
            }
            className="border p-3 w-full mb-4"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="border p-3 w-full mb-4"
          />

          <button
  type="submit"
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  {editingProposalId
    ? "Save Changes"
    : "Save Proposal"}
</button>
        </form>
      )}

<button
  type="button"
  onClick={() => {
    setShowForm(false);
    setEditingProposalId(null);

    setFormData({
      proposal_title: "",
      description: "",
    });
  }}
  className="ml-3 border px-4 py-2 rounded"
>
  Cancel
</button>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((item) => (
          <ProposalStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
{proposals.map((item) => (
  <ProposalCard
    key={item.id}
    proposal={{
      ...item,

      title:
        item.proposal_title ||
        item.title ||
        "Untitled Proposal",

      statusLabel: item.status,

      priority:
        item.priority ||
        "medium",

      department:
        item.submitter?.department?.department_name ||
        "Department",

      date: item.submitted_date
        ? new Date(
            item.submitted_date
          ).toLocaleDateString()
        : "-",
    }}
    onView={handleView}
    onEdit={handleEdit}
    onResubmit={handleResubmit}
    onDelete={handleDelete}
    onSubmitHR={handleSubmitHR}
  />
))}
      </div>

    </div>
  );
}

import { useEffect, useState } from "react";

import ProposalStats from "../../components/hr/trainingRequest/ProposalStats";
import ProposalCard from "../../components/hr/trainingRequest/ProposalCard";
import ProposalDetail from "../../components/hr/trainingRequest/ProposalDetail";
import FilterBar from "../../components/hr/trainingRequest/FilterBar";

import {
  getProposals,
} from "../../services/trainerService";

export default function TrainingRequests() {
  const [proposals, setProposals] =
    useState([]);

  const [
    selectedProposal,
    setSelectedProposal,
  ] = useState(null);

  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    try {
      const data = await getProposals();

      const safeData =
        Array.isArray(data) ? data : [];

      setProposals(safeData);

      if (safeData.length > 0) {
        setSelectedProposal((current) => {
          if (!current) {
            return safeData[0];
          }

          return (
            safeData.find(
              (item) =>
                item.id === current.id
            ) || safeData[0]
          );
        });
      } else {
        setSelectedProposal(null);
      }
    } catch (err) {
      console.error(
        "LOAD PROPOSALS ERROR:",
        err
      );

      setProposals([]);
      setSelectedProposal(null);
    }
  }

  const filteredProposals =
    statusFilter === "all"
      ? proposals
      : proposals.filter(
          (proposal) =>
            proposal.status === statusFilter
        );

  return (
    <div className="space-y-8">
      <FilterBar
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        proposals={filteredProposals}
      />

      <ProposalStats
        proposals={proposals}
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-5">
          {filteredProposals.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-400">
              Tidak ada proposal dengan filter ini.
            </div>
          ) : (
            filteredProposals.map(
              (proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onSelect={() =>
                    setSelectedProposal(
                      proposal
                    )
                  }
                />
              )
            )
          )}
        </div>

        <div className="col-span-8">
          <ProposalDetail
            proposal={selectedProposal}
            onRefresh={loadProposals}
          />
        </div>
      </div>
    </div>
  );
}
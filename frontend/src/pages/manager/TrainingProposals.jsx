import { Plus } from "lucide-react";

import ProposalStatCard from "../../components/manager/proposals/ProposalStatCard";
import ProposalCard from "../../components/manager/proposals/ProposalCard";
import CreateProposalCard from "../../components/manager/proposals/CreateProposalCard";

import {
  stats,
  proposals,
} from "../../components/manager/proposals/proposalsData";

export default function TrainingProposals() {
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
        </div>

        <button className="bg-[#3E4BEB] text-white rounded-2xl px-8 py-4 flex gap-3 items-center shadow-lg">
          <Plus size={20} />
          Create New Proposal
        </button>

      </div>

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item) => (
          <ProposalStatCard
            key={item.title}
            {...item}
          />
        ))}

      </div>

      <div className="grid grid-cols-3 gap-8">

        {proposals.map((item, index) => (
          <ProposalCard
            key={index}
            proposal={item}
          />
        ))}

        <CreateProposalCard />

      </div>

    </div>
  );
}
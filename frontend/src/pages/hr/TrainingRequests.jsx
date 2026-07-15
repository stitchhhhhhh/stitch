import ProposalStats from "../../components/hr/trainingRequest/ProposalStats";
import ProposalCard from "../../components/hr/trainingRequest/ProposalCard";
import ProposalDetail from "../../components/hr/trainingRequest/ProposalDetail";
import FilterBar from "../../components/hr/trainingRequest/FilterBar";

export default function TrainingRequests() {
  return (
    <div className="space-y-8">

      <FilterBar />

      <ProposalStats />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-4 space-y-5">

          <ProposalCard />
          <ProposalCard />
          <ProposalCard />

        </div>

        <div className="col-span-8">

          <ProposalDetail />

        </div>

      </div>

    </div>
  );
}
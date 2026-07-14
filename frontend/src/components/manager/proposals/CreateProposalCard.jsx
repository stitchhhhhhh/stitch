import { Plus } from "lucide-react";

export default function CreateProposalCard() {
  return (
    <button className="border-2 border-dashed border-gray-300 rounded-3xl flex flex-col justify-center items-center p-10 hover:border-[#3E4BEB] transition">

      <div className="w-20 h-20 rounded-full bg-[#EEF1FF] flex items-center justify-center">

        <Plus size={40} color="#3E4BEB" />

      </div>

      <h2 className="text-3xl font-bold mt-8">
        Create New Proposal
      </h2>

      <p className="text-gray-500 mt-3 text-center">
        Submit a request for your department
      </p>

    </button>
  );
}
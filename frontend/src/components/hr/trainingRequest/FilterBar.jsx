import { Filter, Download } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Training Proposals
        </h1>

        <p className="text-gray-500 mt-2">
          Review and approve department training proposals.
        </p>
      </div>

      <div className="flex gap-3">

        <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-50">
          <Filter size={18} />
          Filters
        </button>

        <button className="bg-[#2F3FE4] text-white rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-[#2433c7]">
          <Download size={18} />
          Export Report
        </button>

      </div>

    </div>
  );
}
import { CalendarDays, Users } from "lucide-react";

export default function ProposalCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-[#2F3FE4] shadow-sm hover:shadow-lg transition">

      <div className="flex justify-between items-center mb-4">

        <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
          HIGH PRIORITY
        </span>

        <span className="bg-blue-100 text-[#2F3FE4] text-xs px-3 py-1 rounded-full">
          Pending
        </span>

      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Cloud Security Awareness Program
      </h2>

      <p className="text-gray-500 mt-2">
        IT Department • John Smith
      </p>

      <div className="flex gap-5 text-gray-500 text-sm mt-4">

        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          Oct 26, 2023
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} />
          240 Staff
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">

        <button className="bg-[#2F3FE4] text-white rounded-xl py-3 hover:bg-[#2433c7]">
          Approve
        </button>

        <button className="border rounded-xl py-3 hover:bg-gray-50">
          View Details
        </button>

      </div>

    </div>
  );
}
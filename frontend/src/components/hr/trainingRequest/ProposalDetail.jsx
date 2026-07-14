import {
  Building2,
  Users,
  CheckCircle,
} from "lucide-react";

export default function ProposalDetail() {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      <div className="p-8 border-b">

        <div className="flex justify-between">

          <div>

            <h2 className="text-4xl font-bold">
              Cloud Security Awareness Program
            </h2>

            <div className="flex items-center gap-3 mt-5">

              <span className="bg-blue-100 text-[#2F3FE4] px-3 py-1 rounded-full text-sm">
                IT Department
              </span>

              <span className="text-gray-500">
                Submitted by John Smith
              </span>

            </div>

          </div>

          <div className="text-right">

            <p className="text-xs text-gray-400 uppercase">
              EST. PARTICIPANTS
            </p>

            <h1 className="text-5xl font-bold text-[#2F3FE4]">
              240
            </h1>

          </div>

        </div>

      </div>

      <div className="p-8 space-y-8">

        <div>

          <h3 className="font-bold flex gap-2 items-center mb-4">
            <Building2 size={18} />
            Program Information
          </h3>

          <div className="bg-gray-50 rounded-xl p-5">

            <p className="font-semibold">Objective</p>

            <p className="text-gray-600 mt-2">
              Enhance organizational cybersecurity posture regarding cloud services.
            </p>

            <p className="font-semibold mt-6">
              Description
            </p>

            <p className="text-gray-600 mt-2">
              Comprehensive training covering AWS, Azure,
              cloud security, IAM, compliance, and threat prevention.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div className="bg-gray-50 rounded-xl p-5">

            <h3 className="font-bold flex gap-2 items-center mb-4">
              <Users size={18} />
              Department Context
            </h3>

            <p className="text-4xl font-bold">
              450 Employees
            </p>

            <p className="text-gray-500 mt-3">
              Completion Rate
            </p>

            <div className="h-2 rounded-full bg-gray-200 mt-3">

              <div className="w-[82%] h-2 rounded-full bg-[#2F3FE4]" />

            </div>

          </div>

          <div className="bg-gray-50 rounded-xl p-5">

            <h3 className="font-bold flex gap-2 items-center mb-4">
              <CheckCircle size={18} />
              Proposal Summary
            </h3>

            <ul className="space-y-3 text-gray-700">

              <li>✔ Reduction in security incidents</li>

              <li>✔ ISO 27001 Compliance</li>

              <li>✔ Training goal 95% pass rate</li>

            </ul>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5 pt-4">

          <button className="bg-[#2F3FE4] text-white rounded-xl py-4 text-lg hover:bg-[#2433c7]">
            Approve Proposal
          </button>

          <button className="border border-red-500 text-red-600 rounded-xl py-4 text-lg hover:bg-red-50">
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}
import { Link } from "react-router-dom";

export default function RequestCard({
  request = {
    id: 1,
    title: "Advanced Strategic Leadership",
    description:
      "Comprehensive leadership training designed for managers and senior executives to improve strategic decision making.",
    employee: "Sarah Miller",
    department: "Management",
    category: "Business",
    duration: "12 Hours",
    budget: "$1,200",
    submitted: "Oct 24, 2023",
    status: "Pending Review",
  },
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {request.title}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Submitted by{" "}
            <span className="font-medium text-gray-700">
              {request.employee}
            </span>
            {" • "}
            {request.submitted}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
          {request.status}
        </span>

      </div>

      {/* Description */}
      <p className="text-gray-600 mt-5 leading-relaxed">
        {request.description}
      </p>

      {/* Info */}
      <div className="grid grid-cols-3 gap-4 mt-6">

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Department
          </p>

          <p className="font-semibold text-gray-800 mt-1">
            {request.department}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Duration
          </p>

          <p className="font-semibold text-gray-800 mt-1">
            {request.duration}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Budget
          </p>

          <p className="font-semibold text-gray-800 mt-1">
            {request.budget}
          </p>
        </div>

      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-6">

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          {request.department}
        </span>

        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
          {request.category}
        </span>

      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">

        <button className="flex-1 bg-[#2F3FE4] hover:bg-[#2435d8] text-white rounded-xl py-3 font-medium transition">
          Approve
        </button>

        <button className="flex-1 border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition">
          Request Revision
        </button>

        <Link
          to={`/hr/course-requests/${request.id}`}
          className="flex-1 text-center border border-[#2F3FE4] text-[#2F3FE4] rounded-xl py-3 font-medium hover:bg-blue-50 transition"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}
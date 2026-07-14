export default function Breadcrumb() {
  return (
    <div className="space-y-4">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Dashboard</span>
        <span>›</span>
        <span>Course Requests</span>
        <span>›</span>

        <span className="text-[#2F3FE4] font-semibold">
          Advanced Cloud Architecture Review
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
          Pending Review
        </span>

        <span className="text-gray-500 text-sm">
          Submitted 2 days ago
        </span>
      </div>

      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Advanced Cloud Architecture
          </h1>

          <p className="text-gray-500 mt-2 max-w-3xl">
            A comprehensive deep-dive into multi-cloud strategy,
            serverless orchestration and high-availability
            patterns for enterprise-scale deployments.
          </p>
        </div>

        <div className="flex gap-3">

          <button className="border rounded-xl px-6 py-3 hover:bg-gray-50">
            👁 Preview
          </button>

          <button className="border rounded-xl px-6 py-3 hover:bg-gray-50">
            Share
          </button>

        </div>

      </div>

    </div>
  );
}
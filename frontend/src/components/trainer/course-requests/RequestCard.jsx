import ProgressBar from "./ProgressBar";

export default function RequestCard({
  request,
  onView,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#253B80]">
            {request.title}
          </h2>

          <div className="flex gap-3 mt-3 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${request.statusColor}`}
            >
              {request.statusLabel}
            </span>

            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
              {request.type}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onView(request)}
          className="border rounded-xl px-5 py-2 hover:bg-gray-100"
        >
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <p className="text-gray-500 text-sm">
            Requested By
          </p>

          <p className="font-semibold mt-1">
            {request.requester}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Date
          </p>

          <p className="font-semibold mt-1">
            {request.date}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Progress
          </p>

          <div className="mt-2">
            <ProgressBar
              progress={request.progress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
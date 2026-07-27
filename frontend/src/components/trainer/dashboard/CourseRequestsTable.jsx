export default function CourseRequestsTable({
  requests = [],
  onAccept,
  onViewAll,
  processingRequestId = null,
}) {
  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-GB");
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-[#253B80]">
            Recent Course Requests
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Latest requests submitted by HR and Managers
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[#3046D3] font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          No course requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Requester</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.slice(0, 5).map((item) => {
                const isProcessing =
                  processingRequestId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-semibold">
                      {item.program?.program_name ?? "-"}
                    </td>

                    <td className="px-6 py-5">
                      {item.requester?.full_name ?? "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status || "unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-500">
                      {formatDate(item.request_date)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        {item.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() =>
                              onAccept(item.id)
                            }
                            disabled={isProcessing}
                            className="px-4 py-2 rounded-lg bg-[#3046D3] text-white hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isProcessing
                              ? "Accepting..."
                              : "Accept"}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

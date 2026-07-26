export default function RequestDetailPanel({
  request,
  onAccept,
  onReject,
  updating = false,
}) {
  if (!request) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">
          Select a request to view details.
        </p>
      </div>
    );
  }

  const canRespond = request.rawStatus === "pending";

  return (
    <div className="space-y-8 rounded-3xl bg-white p-8 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-[#253B80]">
          {request.title}
        </h2>

        <p className="mt-2 text-gray-500">
          Request ID: {request.id}
        </p>

        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${request.statusColor}`}
        >
          {request.status}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold">
          Learning Objective
        </h3>

        <p className="mt-2 leading-7 text-gray-600">
          {request.objective}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Target Audience
        </h3>

        {request.audience?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {request.audience.map((item) => (
              <span
                key={item}
                className="rounded-full bg-blue-50 px-4 py-2 text-sm text-[#3046D3]"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No target audience information.
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Expected Learning Outcomes
        </h3>

        {request.outcomes?.length > 0 ? (
          <ul className="space-y-3">
            {request.outcomes.map((item) => (
              <li key={item} className="flex gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-[#3046D3]" />

                <span className="text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No learning outcomes information.
          </p>
        )}
      </div>

      {canRespond && (
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            disabled={updating}
            onClick={() => onAccept(request)}
            className="rounded-xl bg-[#3046D3] px-6 py-3 text-white transition hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Processing..." : "Accept Request"}
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={() => onReject(request)}
            className="rounded-xl border px-6 py-3 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Request
          </button>
        </div>
      )}
    </div>
  );
}

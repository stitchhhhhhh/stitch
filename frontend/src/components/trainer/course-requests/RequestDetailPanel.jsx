export default function RequestDetailPanel({
  request,
  onAccept,
  onReject,
  processing = false,
}) {
  if (!request) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <p className="text-gray-500">
          Select a request to view details.
        </p>
      </div>
    );
  }

  const canRespond = request.status === "pending";

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#253B80]">
          {request.title}
        </h2>

        <p className="text-gray-500 mt-2">
          Request ID: {request.id}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          Program Type
        </h3>

        <p className="text-gray-600 mt-2">
          {request.type}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          Learning Objective
        </h3>

        <p className="text-gray-600 mt-2 leading-7">
          {request.objective}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          Requested By
        </h3>

        <p className="text-gray-600 mt-2">
          {request.requester}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          Current Status
        </h3>

        <span
          className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-medium ${request.statusColor}`}
        >
          {request.statusLabel}
        </span>
      </div>

      {canRespond && (
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            disabled={processing}
            onClick={() => onAccept(request)}
            className="bg-[#3046D3] disabled:opacity-50 text-white px-6 py-3 rounded-xl hover:bg-[#253B80] transition"
          >
            {processing
              ? "Processing..."
              : "Accept Request"}
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={() => onReject(request)}
            className="border disabled:opacity-50 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
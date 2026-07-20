export default function RequestDetailPanel({
  request,
  onAccept,
  onReject,
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
          Learning Objective
        </h3>

        <p className="text-gray-600 mt-2 leading-7">
          {request.objective}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">
          Target Audience
        </h3>

        <div className="flex flex-wrap gap-3">
          {(request.audience || []).map((item) => (
            <span
              key={item}
              className="bg-blue-50 text-[#3046D3] px-4 py-2 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">
          Expected Learning Outcomes
        </h3>

        <ul className="space-y-3">
          {(request.outcomes || []).map((item) => (
            <li
              key={item}
              className="flex gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-[#3046D3] mt-2" />

              <span className="text-gray-700">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => onAccept(request)}
          className="bg-[#3046D3] text-white px-6 py-3 rounded-xl hover:bg-[#253B80] transition"
        >
          Accept Request
        </button>

        <button
          type="button"
          onClick={() => onReject(request)}
          className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
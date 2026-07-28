export default function RecentRequestsTable({ requests = [], onViewAll }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Recent Course Requests</h2>
        <button type="button" onClick={onViewAll} className="text-[#2F3FE4] font-semibold hover:underline">View All Requests</button>
      </div>
      {requests.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No course requests available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-gray-500 border-b"><th className="pb-4">Requester</th><th className="pb-4">Program</th><th className="pb-4">Trainer</th><th className="pb-4">Department</th><th className="pb-4">Date</th><th className="pb-4">Status</th></tr></thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b last:border-0">
                  <td className="py-4 font-medium">{request.requester}</td><td>{request.program}</td><td>{request.trainer}</td><td>{request.department}</td><td>{new Date(request.date).toLocaleDateString()}</td><td className="capitalize">{request.status.replaceAll("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

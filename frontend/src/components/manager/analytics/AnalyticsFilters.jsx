export default function AnalyticsFilters() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5">

      <h3 className="font-semibold text-[#253B80] mb-4">
        Focus Filters
      </h3>

      <div className="space-y-4">

        <div>

          <label className="text-sm text-gray-500 block mb-2">
            Training Program
          </label>

          <select className="border rounded-xl w-full px-4 py-2">

            <option>All Programs</option>
            <option>Cyber Security</option>
            <option>Cloud Infrastructure</option>

          </select>

        </div>

        <div>

          <label className="text-sm text-gray-500 block mb-2">
            Completion Status
          </label>

          <select className="border rounded-xl w-full px-4 py-2">

            <option>All Status</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Overdue</option>

          </select>

        </div>

      </div>

    </div>
  );
}
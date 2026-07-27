export default function DepartmentComparison({ departments = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-8">Department Comparison</h2>
      {departments.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No department training data available.</div>
      ) : (
        <div className="space-y-8">
          {departments.map((department) => (
            <div key={department.id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">{department.name}</span>
                <span className="text-gray-500">{department.completionRate}%</span>
              </div>
              <div className="h-3 rounded-full bg-indigo-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#2F3FE4]" style={{ width: `${department.completionRate}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

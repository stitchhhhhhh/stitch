const departments = [
  {
    name: "Engineering",
    value: 92,
  },
  {
    name: "Sales",
    value: 78,
  },
  {
    name: "Marketing",
    value: 85,
  },
  {
    name: "Human Resources",
    value: 98,
  },
];

export default function DepartmentComparison() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 h-full">

      <h2 className="text-xl font-semibold text-gray-800 mb-8">
        Department Comparison
      </h2>

      <div className="space-y-8">

        {departments.map((dept) => (
          <div key={dept.name}>

            <div className="flex justify-between mb-2">

              <span className="font-medium text-gray-700">
                {dept.name}
              </span>

              <span className="text-gray-500">
                {dept.value}%
              </span>

            </div>

            <div className="h-3 rounded-full bg-indigo-100 overflow-hidden">

              <div
                className="h-full rounded-full bg-[#2F3FE4]"
                style={{
                  width: `${dept.value}%`,
                }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
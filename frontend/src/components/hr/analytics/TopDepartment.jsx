export default function TopDepartment() {
  const departments = [
    {
      name: "Strategy & Operations",
      completion: "98%",
    },
    {
      name: "Product Engineering",
      completion: "95%",
    },
    {
      name: "Human Resources",
      completion: "93%",
    },
    {
      name: "Finance",
      completion: "90%",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#253B80]">
        Top Departments
      </h2>

      <p className="text-gray-500 text-sm mt-1">
        Highest completion rate
      </p>

      <div className="mt-6 space-y-5">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className="flex justify-between items-center"
          >
            <span>{dept.name}</span>

            <span className="font-bold text-[#2F3FE4]">
              {dept.completion}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
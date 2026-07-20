export default function RequestStats({ courses = [] }) {
  const stats = [
    {
      title: "Pending Review",
      value: courses.filter((c) => c.approval_status === "submitted").length,
      color: "bg-yellow-100",
      text: "text-yellow-600",
      icon: "⏳",
    },
    {
      title: "Approved Courses",
      value: courses.filter((c) => c.approval_status === "approved").length,
      color: "bg-green-100",
      text: "text-green-600",
      icon: "✅",
    },
    {
      title: "Rejected Courses",
      value: courses.filter((c) => c.approval_status === "rejected").length,
      color: "bg-red-100",
      text: "text-red-600",
      icon: "❌",
    },
    {
      title: "Total Courses",
      value: courses.length,
      color: "bg-blue-100",
      text: "text-blue-600",
      icon: "📚",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

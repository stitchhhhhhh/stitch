export default function ProgramStats() {
  const stats = [
    {
      title: "Active Programs",
      value: "12",
      color: "bg-[#EEF2FF]",
      text: "text-[#3948F2]",
      icon: "📚",
    },
    {
      title: "Employees Enrolled",
      value: "2,450",
      color: "bg-[#ECFDF3]",
      text: "text-[#039855]",
      icon: "👥",
    },
    {
      title: "Completion Rate",
      value: "84%",
      color: "bg-[#FFF7ED]",
      text: "text-[#EA580C]",
      icon: "📈",
    },
    {
      title: "Certificates Issued",
      value: "1,120",
      color: "bg-[#FEF3F2]",
      text: "text-[#D92D20]",
      icon: "🏆",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>

              <h2 className="text-4xl font-bold mt-3 text-gray-900">
                {stat.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}
            >
              <span>{stat.icon}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${stat.text.replace(
                  "text",
                  "bg"
                )}`}
                style={{
                  width: "75%",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
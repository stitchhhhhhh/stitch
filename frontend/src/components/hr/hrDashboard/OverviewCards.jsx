import {
  Users,
  BarChart3,
  BookOpen,
  Award,
} from "lucide-react";

const icons = {
  users: Users,
  chart: BarChart3,
  book: BookOpen,
  award: Award,
};

export default function OverviewCards({ summary = {} }) {
  const completionRate = Number(summary.completionRate) || 0;

  const overviewData = [
    {
      title: "TOTAL EMPLOYEES",
      value: summary.totalEmployees ?? 0,
      icon: "users",
    },
    {
      title: "AVG. COMPLETION",
      value: `${completionRate.toFixed(2)}%`,
      icon: "chart",
    },
    {
      title: "TOTAL COURSES",
      value: summary.totalCourses ?? 0,
      icon: "book",
    },
    {
      title: "CERTIFICATES ISSUED",
      value: summary.certificatesIssued ?? 0,
      icon: "award",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {overviewData.map((item) => {
        const Icon = icons[item.icon];

        return (
          <div
            key={item.title}
            className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Icon
                  size={28}
                  className="text-[#2F3FE4]"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-1 text-gray-800">
                  {item.value}
                </h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
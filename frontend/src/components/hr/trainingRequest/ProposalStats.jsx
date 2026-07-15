import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function ProposalStats() {
  const stats = [
    {
      title: "Pending Proposals",
      value: 18,
      icon: <ClipboardList size={22} />,
      bg: "bg-blue-100",
      color: "text-[#2F3FE4]",
    },
    {
      title: "Approved Proposals",
      value: 42,
      icon: <CheckCircle size={22} />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Rejected Proposals",
      value: 5,
      icon: <XCircle size={22} />,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Avg. Approval Time",
      value: "3.2 days",
      icon: <Clock size={22} />,
      bg: "bg-gray-100",
      color: "text-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}
          >
            {item.icon}
          </div>

          <p className="text-gray-500 text-sm mt-4">{item.title}</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
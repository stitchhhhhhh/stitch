import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";
export default function ProposalStats({ proposals = [] }) {
  const reviewed = proposals.filter((item) => item.review_date && item.submitted_date);
  const averageDays = reviewed.length ? (reviewed.reduce((sum, item) => sum + (new Date(item.review_date) - new Date(item.submitted_date)) / 86400000, 0) / reviewed.length).toFixed(1) : "0.0";
  const stats = [
    { title: "Pending Proposals", value: proposals.filter((p) => p.status === "pending").length, icon: <ClipboardList size={22}/> },
    { title: "Approved Proposals", value: proposals.filter((p) => p.status === "approved").length, icon: <CheckCircle size={22}/> },
    { title: "Rejected Proposals", value: proposals.filter((p) => p.status === "rejected").length, icon: <XCircle size={22}/> },
    { title: "Avg. Approval Time", value: `${averageDays} days`, icon: <Clock size={22}/> },
  ];
  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">{stats.map((item) => <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"><div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-[#2F3FE4]">{item.icon}</div><p className="text-gray-500 text-sm mt-4">{item.title}</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{item.value}</h2></div>)}</div>;
}

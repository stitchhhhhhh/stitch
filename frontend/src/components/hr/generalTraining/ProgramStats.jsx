export default function ProgramStats({ summary = {} }) {
  const stats = [
    { title: "Active Programs", value: summary.activePrograms || 0, icon: "📚" },
    { title: "Employees Enrolled", value: summary.activeLearners || 0, icon: "👥" },
    { title: "Completion Rate", value: `${summary.completionRate || 0}%`, icon: "📈" },
    { title: "Certificates Issued", value: summary.certificatesIssued || 0, icon: "🏆" },
  ];
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">{stats.map((stat) => <div key={stat.title} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">{stat.title}</p><h2 className="text-4xl font-bold mt-3 text-gray-900">{stat.value}</h2></div><div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-2xl">{stat.icon}</div></div></div>)}</div>;
}

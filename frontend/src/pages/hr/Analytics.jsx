import { useEffect, useState } from "react";
import { getHROverview } from "../../services/hrService";

function Metric({ label, value }) {
  return <div className="bg-white rounded-3xl p-6 shadow-sm"><p className="text-gray-500">{label}</p><h2 className="text-3xl font-bold mt-2">{value}</h2></div>;
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { getHROverview().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="bg-white rounded-3xl p-8">Loading analytics...</div>;
  if (error) return <div className="bg-red-50 text-red-600 rounded-3xl p-8">{error}</div>;
  const summary = data?.summary || {};
  const departments = data?.departments || [];
  const trend = data?.monthlyTrend || { labels: [], values: [] };
  const maxTrend = Math.max(...trend.values, 1);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Metric label="Total Employees" value={summary.totalEmployees || 0} />
        <Metric label="Completion Rate" value={`${summary.completionRate || 0}%`} />
        <Metric label="Active Learners" value={summary.activeLearners || 0} />
        <Metric label="Certificates Issued" value={summary.certificatesIssued || 0} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#253B80]">Monthly Completion Trend</h2><p className="text-gray-500 mt-1">Completed enrollments from the database during the last 12 months.</p>
          <div className="h-72 mt-8 flex items-end gap-3 border-b border-gray-200">
            {trend.values.map((value, index) => <div key={`${trend.labels[index]}-${index}`} className="flex-1 flex flex-col justify-end items-center h-full"><span className="text-xs text-gray-500 mb-2">{value}</span><div className="w-full max-w-10 bg-[#2F3FE4] rounded-t" style={{ height: `${(value / maxTrend) * 85}%` }} /><span className="text-xs text-gray-500 mt-2">{trend.labels[index]}</span></div>)}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm"><h2 className="text-xl font-semibold">Course Statistics</h2><div className="mt-8 space-y-6">{[["Completed", data?.courseStatistics?.completed || 0],["In Progress", data?.courseStatistics?.inProgress || 0],["Not Started", data?.courseStatistics?.notStarted || 0]].map(([label,value]) => <div key={label}><div className="flex justify-between"><span>{label}</span><strong>{value}</strong></div><div className="h-2 bg-gray-100 rounded-full mt-2"><div className="h-2 bg-[#2F3FE4] rounded-full" style={{ width: `${summary.totalEnrollments ? (value / summary.totalEnrollments) * 100 : 0}%` }} /></div></div>)}</div></div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden"><div className="p-8"><h2 className="text-2xl font-semibold">Training Statistics by Department</h2><p className="text-gray-500 mt-2">Department-level results calculated from enrollments and assessments.</p></div>
        {departments.length === 0 ? <div className="p-12 text-center text-gray-400">No department analytics available.</div> : <div className="overflow-x-auto"><table className="w-full"><thead className="bg-[#F7F8FD]"><tr className="text-left"><th className="px-6 py-5">Department</th><th>Learners</th><th>Enrollments</th><th>Completion</th><th>Average Score</th></tr></thead><tbody>{departments.map((department) => <tr key={department.id} className="border-t"><td className="px-6 py-5 font-semibold">{department.name}</td><td>{department.learners}</td><td>{department.enrollments}</td><td>{department.completionRate}%</td><td>{department.averageScore}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
}

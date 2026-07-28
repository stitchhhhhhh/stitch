import { useEffect, useState } from "react";
import { Download, Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { exportHRReport, getHROverview } from "../../services/hrService";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  useEffect(() => { getHROverview().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  async function handleExport() { try { setExporting(true); const blob = await exportHRReport("pdf"); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "training-report.pdf"; a.click(); URL.revokeObjectURL(url); } catch (e) { alert(e.message); } finally { setExporting(false); } }
  if (loading) return <div className="bg-white rounded-3xl p-8">Loading reports...</div>;
  if (error) return <div className="bg-red-50 text-red-600 rounded-3xl p-8">{error}</div>;
  const summary = data?.summary || {};
  const stats = [
    { label: "Employees Trained", value: summary.activeLearners || 0, Icon: Users },
    { label: "Courses Completed", value: summary.completedEnrollments || 0, Icon: BookOpen },
    { label: "Certificates Issued", value: summary.certificatesIssued || 0, Icon: GraduationCap },
    { label: "Completion Rate", value: `${summary.completionRate || 0}%`, Icon: TrendingUp },
  ];
  return <div className="space-y-8"><div className="flex justify-between items-center"><div><h1 className="text-4xl font-bold text-[#253B80]">Training Reports</h1><p className="text-gray-500 mt-2">Generate and export training performance reports across the organization.</p></div><button onClick={handleExport} disabled={exporting} className="bg-[#2F3FE4] text-white px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"><Download size={18}/>{exporting ? "Exporting..." : "Export Report"}</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">{stats.map(({label,value,Icon}) => <div key={label} className="bg-white rounded-2xl p-6 shadow-sm"><Icon className="text-[#2F3FE4]" size={30}/><p className="text-gray-500 mt-4">{label}</p><h2 className="text-3xl font-bold mt-1">{value}</h2></div>)}</div>
    <div className="bg-white rounded-2xl shadow-sm p-6"><h2 className="text-2xl font-bold mb-6">Department Report</h2>{(data?.departments || []).length === 0 ? <div className="py-12 text-center text-gray-400">No report data available.</div> : <table className="w-full"><thead><tr className="border-b text-left"><th className="py-3">Department</th><th>Learners</th><th>Completion Rate</th><th>Average Score</th></tr></thead><tbody>{data.departments.map((d) => <tr key={d.id} className="border-b"><td className="py-4">{d.name}</td><td>{d.learners}</td><td>{d.completionRate}%</td><td>{d.averageScore}</td></tr>)}</tbody></table>}</div>
  </div>;
}

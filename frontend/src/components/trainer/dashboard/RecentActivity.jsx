import { CheckCircle2, AlertTriangle, Rocket } from "lucide-react";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function getIcon(type) {
  if (type === "approved") return <CheckCircle2 size={22} className="text-green-500" />;
  if (type === "rejected") return <AlertTriangle size={22} className="text-red-500" />;
  return <Rocket size={22} className="text-[#3046D3]" />;
}

export default function RecentActivity({ courses = [], materials = [] }) {
  const courseEvents = courses.map((c) => ({
    id: `course-${c.id}`,
    title:
      c.approval_status === "approved"
        ? `${c.course_title} course approved.`
        : c.approval_status === "rejected"
        ? `${c.course_title} requires revision.`
        : `${c.course_title} course created.`,
    date: c.created_date,
    type: c.approval_status,
  }));

  const materialEvents = materials.map((m) => ({
    id: `material-${m.id}`,
    title: `${m.material_title} uploaded.`,
    date: m.uploaded_date,
    type: "material",
  }));

  const activities = [...courseEvents, ...materialEvents]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#253B80]">
          Recent Activity
        </h2>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm">No recent activity.</p>
      ) : (
        <div className="space-y-6">
          {activities.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="mt-1">{getIcon(item.type)}</div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{timeAgo(item.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

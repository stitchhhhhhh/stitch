import { CheckCircle2, BookOpen, Award, ClipboardCheck } from "lucide-react";

const icons = { completion: CheckCircle2, enrollment: BookOpen, certificate: Award, assessment: ClipboardCheck };

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-xl font-semibold mb-8">Recent Employee Activity</h2>
      {activities.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No recent employee activity.</div>
      ) : (
        <div className="space-y-8">
          {activities.map((item, index) => {
            const Icon = icons[item.type] || BookOpen;
            return (
              <div key={`${item.type}-${item.date}-${index}`} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Icon size={22} className="text-[#2F3FE4]" />
                </div>
                <div>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="font-semibold">{item.user}</span> {item.action}{" "}
                    <span className="text-[#2F3FE4] font-semibold">{item.target}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{new Date(item.date).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
